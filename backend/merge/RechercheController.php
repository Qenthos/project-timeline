<?php

namespace App\Controller;

use App\DataFixtures\AppFixtures;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Psr\Log\LoggerInterface;

use Doctrine\ORM\EntityManagerInterface;

use App\DataFixtures\Spotify;
use App\DataFixtures\Ebay;
use App\Entity\Catalogue\Livre;
use App\Entity\Catalogue\Musique;
use App\Entity\Catalogue\Piste;
use App\Entity\Catalogue\Article;

class RechercheController extends AbstractController
{
	private EntityManagerInterface $entityManager;
	private LoggerInterface $logger;
	private $panier;

	public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
	{
		$this->entityManager = $entityManager;
		$this->logger = $logger;
	}

	#[Route('/afficheRecherche', name: 'afficheRecherche')]
	public function afficheRechercheAction(Request $request): Response
	{
		// if(session_status() != 0) {
		// 	session_destroy();
		// }

		// $query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a");
		// $articles = $query->getResult();
	
		$articles = $request->query->get('articles') ?? [];
		$session = $request->getSession();

		if ($session->get("panier") != null) {
			$this->panier = $session->get("panier");
			$qtePanier = sizeof($this->panier->getLignesPanier()) ?? 0;
		}

			// Vider le panier seulement si l'achat a été effectué
		if ($session->get("achat_effectue", false)) {		
			if ($session->has("panier")) {
				$this->panier = $session->get("panier");
				$this->panier->viderPanier(); // Vider le panier
				$session->set("panier", $this->panier); // Remettre le panier à vide
				$qtePanier = 0; //Remet le panier a zéro
			}
	
			// Réinitialiser l'état d'achat à false (pas d'achat effectué)
			$session->set("achat_effectue", false);
		}

		return $this->render('recherche.html.twig', [
			'articles' => $articles,
			'id' => $id ?? 0,
			'qtePanier' => $qtePanier ?? 0,
			'product' => " "
		]);
	}

	#[Route('/afficheRechercheParMotCle', name: 'afficheRechercheParMotCle')]
	public function afficheRechercheParMotCleAction(Request $request): Response
	{
		//$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a "
		//										  ." where a.titre like :motCle");
		//$query->setParameter("motCle", "%".$request->query->get("motCle")."%") ;
		$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a "
			. " where a.titre like '%" . addslashes($request->query->get("motCle")) . "%'");
		$articles = $query->getResult();
		return $this->render('recherche.html.twig', [
			'articles' => $articles,
		]);
	}


	#[Route('/afficherProduit', name: 'afficherProduit')]
	public function afficherProduit(Request $request): Response
	{

		$article = $this->entityManager->getReference("App\Entity\Catalogue\Article", $request->query->get("id"));
		return $this->render('produit.html.twig', [
			'article' => $article,
		]);
	}

	// #[Route('/afficherProduitSupp', name: 'afficherProduit')]
	// public function afficherProduitSupp(Request $request): Response
	// {

	// 	$this->rechercheArticles($request);

	// 	$article = $this->entityManager->getReference("App\Entity\Catalogue\Article", $request->query->get("id"));
	// 	return $this->render('recherche.html.twig', [
	// 		'article' => $article,
	// 	]);
	// }

	#[Route('/rechercheArticles', name: 'rechercheArticles')]
	public function rechercheArticles(Request $request): Response
	{		
		
		function isInDatabase($objectID, $entityManager): bool {

			$articleExiste = $entityManager
    		->getRepository(Article::class)
    		->find($objectID);

			// $query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a WHERE a = $object");
			// $result = $query->getResult(); 

			if($articleExiste) {
				return true;
			} else {
				return false;
			}

		}


		$recherche = $request->query->get("name");
		$searchCategorie = $request->query->get("categorie");
	
	
		$ebay = new Ebay($this->logger);
		// $test = $ebay->setCategory($searchCategorie);

		// $ebay->setCategory('CDs');
		$keywords = $recherche;
		// $ebay->setCategory('Livres');
		// $keywords = "Les misérables";

	
		$formattedResponse = $ebay->findItemsAdvanced($keywords, 6);
		file_put_contents("ebayResponse.xml", $formattedResponse);
		$xml = simplexml_load_string($formattedResponse);

		// $test = $ebay->getParentCategoryIdByName("Livres");
		// var_dump($test);
		// die;

		$this->entityManager->clear();
		$resultatsRecherche = [];

		if ($xml !== false) {
			foreach ($xml->children() as $child_1) {
				if ($child_1->getName() === "item") {
					if ($ebay->getParentCategoryIdById($child_1->primaryCategory->categoryId) == $ebay->getParentCategoryIdByName($searchCategorie)) {					
						if(!isInDatabase($child_1->itemId, $this->entityManager)) {
							$entityLivre = new Livre();
							$entityLivre->setId((int) $child_1->itemId);
							$title = $ebay->getItemSpecific("Book Title", $child_1->itemId);
							if ($title == null) $title = $child_1->title;
							$entityLivre->setTitre($title);
							$author = $ebay->getItemSpecific("Author", $child_1->itemId);
							if ($author == null) $author = "";
							$entityLivre->setAuteur($author);
							$entityLivre->setISBN("");
							$entityLivre->setPrix((float) $child_1->sellingStatus->currentPrice);
							$entityLivre->setDisponibilite(1);
							$entityLivre->setImage($child_1->galleryURL);
							$this->entityManager->persist($entityLivre);
							$this->entityManager->flush();
						} else {
							$entityLivre = $this->entityManager
							->getRepository(Livre::class)
							->find($child_1->itemId);
						}
						$resultatsRecherche[] = $entityLivre;
					}  else if ($ebay->getParentCategoryIdById($child_1->primaryCategory->categoryId) == $ebay->getParentCategoryIdByName($searchCategorie)) {
							if(!isInDatabase($child_1->itemId, $this->entityManager)) {
								$entityLivre = new Article();
								$entityLivre->setId((int) $child_1->itemId);
								$title = $ebay->getItemSpecific("Book Title", $child_1->itemId);
								if ($title == null) $title = $child_1->title;
								$entityLivre->setTitre($title);
								$author = $ebay->getItemSpecific("Author", $child_1->itemId);
								if ($author == null) $author = "";
								$entityLivre->setPrix((float) $child_1->sellingStatus->currentPrice);
								$entityLivre->setDisponibilite(1);
								// $entityLivre->setCategory($searchCategorie);
								$entityLivre->setImage($child_1->galleryURL);
								$this->entityManager->persist($entityLivre);
								$this->entityManager->flush();
							} else {
								$entityLivre = $this->entityManager
								->getRepository(Livre::class)
								->find($child_1->itemId);
							}
							$resultatsRecherche[] = $entityLivre;
					}						
					
					else if ($ebay->getParentCategoryIdById($child_1->primaryCategory->categoryId) == $ebay->getParentCategoryIdByName($searchCategorie)) {
						if(!isInDatabase($child_1->itemId, $this->entityManager)) {
						$entityMusique = new Musique();
						$entityMusique->setId((int) $child_1->itemId);
						$title = $ebay->getItemSpecific("Release Title", $child_1->itemId);
						if ($title == null) $title = $child_1->title;
						$entityMusique->setTitre($title);
						$artist = $ebay->getItemSpecific("Artist", $child_1->itemId);
						if ($artist == null) $artist = "";
						$entityMusique->setArtiste($artist);
						$entityMusique->setDateDeParution("");
						$entityMusique->setPrix((float) $child_1->sellingStatus->currentPrice);
						$entityMusique->setDisponibilite(1);
						$entityMusique->setImage($child_1->galleryURL);
						if (!isset($albums)) {
							$spotify = new Spotify($this->logger);
							$albums = $spotify->searchAlbumsByArtist($keywords);
						}
						$j = 0;
						$sortir = ($j == count($albums));
						$albumTrouve = false;
						while (!$sortir) {
							$titreSpotify = str_replace(" ", "", mb_strtolower($albums[$j]->name));
							$titreEbay = str_replace(" ", "", mb_strtolower($entityMusique->getTitre()));
							$titreSpotify = str_replace("-", "", $titreSpotify);
							$titreEbay = str_replace("-", "", $titreEbay);
							$albumTrouve = ($titreSpotify == $titreEbay);
							if (mb_strlen($titreEbay) > mb_strlen($titreSpotify))
								$albumTrouve = $albumTrouve || (mb_strpos($titreEbay, $titreSpotify) !== false);
							if (mb_strlen($titreSpotify) > mb_strlen($titreEbay))
								$albumTrouve = $albumTrouve || (mb_strpos($titreSpotify, $titreEbay) !== false);
							$j++;
							$sortir = $albumTrouve || ($j == count($albums));
						}
						if ($albumTrouve) {
							$tracks = $spotify->searchTracksByAlbum($albums[$j - 1]->id);
							foreach ($tracks as $track) {
								$entityPiste = new Piste();
								$entityPiste->setTitre($track->name);
								$entityPiste->setMp3($track->preview_url);
								$this->entityManager->persist($entityPiste);
								$entityMusique->addPiste($entityPiste);
							}
						}
						$this->entityManager->persist($entityMusique);
						$this->entityManager->flush();
						} else {
							$entityMusique = $this->entityManager
							->getRepository(Musique::class)
							->find($child_1->itemId);
						}
						$resultatsRecherche[] = $entityMusique;
					} else {
						if(!isInDatabase($child_1->itemId, $this->entityManager)) {
						$entityArticle = new Article();
						$entityArticle->setId((int) $child_1->itemId);
						$title = $ebay->getItemSpecific("Book Title", $child_1->itemId);
						if ($title == null) $title = $child_1->title;
						$entityArticle->setTitre($title);
						$entityArticle->setPrix((float) $child_1->sellingStatus->currentPrice);
						$entityArticle->setDisponibilite(1);
						$entityArticle->setImage($child_1->galleryURL);
						$this->entityManager->persist($entityArticle);
						$this->entityManager->flush();
						} else {
							$entityArticle = $this->entityManager
							->getRepository(Article::class)
							->find($child_1->itemId);
						}
						$resultatsRecherche[] = $entityArticle;
					}
				}
			}
		}

		// $query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a");
		// $articles = $query->getResult();
		// $id = 0;

		return $this->render('recherche.html.twig', [
			'articles' => $resultatsRecherche,
			// 'categorie' => $searchCategorie,
			'id' => $id ?? 0,
			'qtePanier' => $qtePanier ?? 0,
			'product' => " "
		]);
	}
}