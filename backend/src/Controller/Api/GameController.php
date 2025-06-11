<?php

namespace App\Controller\Api;

use App\Entity\Game;
use ApiPlatform\OpenApi\Model\Response;
use App\Entity\Category;
use App\Repository\GameRepository;
use App\Repository\UserRepository;
use App\Repository\CategoryRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;


class GameController extends AbstractController
{

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route('api/user/{id}/games', name: "gamesByUser", methods: ['GET'])]
    public function listPlayerGames(GameRepository $gameRepository, int $id): JsonResponse
    {

        $games = $gameRepository->findAllGamesByUser($id);
        return $this->json($games);
    }

    #[Route('api/user/{id}/games/top', name: "gamesTopByUser", methods: ['GET'])]
    public function listPlayerTopGames(GameRepository $gameRepository, int $id): JsonResponse
    {

        $gamesTop = $gameRepository->findTopGames($id);
        return $this->json($gamesTop);
    }

    #[Route('api/user/{id}/games/{idg}', name: "gameByIdAndUser", methods: ['GET'])]
    public function getGameByIdAndUser(GameRepository $gameRepository, int $id, int $idg): JsonResponse
    {

        $game = $gameRepository->findGameByIdAndUser($id, $idg);
        return $this->json($game);
    }

    // AJOUT 

    #[Route('api/user/{id}/games', name: "addGameToUser", methods: ['POST'])]
    public function addGameToUser(int $id, Request $request, UserRepository $userRepo, CategoryRepository $catRepo): JsonResponse
    {
        $user = $userRepo->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found']);
        }

        $data = json_decode($request->getContent(), true);
        $categorie = $catRepo->findOneByName($data["categorie"]) ?? new Category($data["categorie"]);

        $game = new Game();
        $game->setPlayer($user);
        $game->setCategorie($categorie);

        $this->entityManager->persist($game);
        $this->entityManager->flush();

        return $this->json(['message' => 'Game added', 'id' => $game->getId()]);
    }

    #[Route('api/user/{id}/games/{idg}', name: "editGameOfUser", methods: ['PATCH'])]
    public function editGameOfUser(int $id, int $idg, Request $request, UserRepository $userRepo, GameRepository $gameRepo, CategoryRepository $catRepo): JsonResponse
    {
        $user = $userRepo->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $game = $gameRepo->find($idg);
        if (!$game || $game->getPlayer()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Game not found for this user'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Mise à jour des champs si présents dans la requête
        if (isset($data['score'])) {
            $game->setScore($data['score']);
        }

        if (isset($data['complete'])) {
            $game->setComplete($data['complete']);
        }

        if (isset($data['nb_try'])) {
            $game->setNbTry($data['nb_try']);
        }

        if (isset($data['categorie'])) {
            $categorie = $catRepo->findOneByName($data["categorie"]["name"]) ?? new Category($data["categorie"]);
            $game->setCategorie($categorie);
        }

        $this->entityManager->persist($game); //
        $this->entityManager->flush();

        return $this->json(['message' => 'Game updated']);
    }

    #[Route('api/user/{id}/games/{gameId}', name: 'removeGameFromUser', methods: ['DELETE'])]
    public function removeGameFromUser(int $id, int $gameId, GameRepository $gameRepo, UserRepository $userRepo) : JsonResponse {
        // Vérification de l'existence de l'utilisateur
        $user = $userRepo->find($id);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur introuvable'], 404);
        }

        // Récupération du jeu
        $game = $gameRepo->find($gameId);
        if (!$game) {
            return $this->json(['error' => 'Jeu introuvable'], 404);
        }

        // Vérifie si le jeu appartient bien à l'utilisateur (sécurité logique)
        if ($game->getPlayer()->getId() !== $id) {
            return $this->json(['error' => 'Ce jeu n’appartient pas à cet utilisateur'], 403);
        }

        // Suppression et flush
        $this->entityManager->remove($game);
        $this->entityManager->flush();

        return $this->json(['message' => 'Partie supprimée avec succès']);
    }
}
