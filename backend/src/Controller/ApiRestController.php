<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Psr\Log\LoggerInterface;

use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Catalogue\Livre;
use App\Entity\Catalogue\Musique;
use App\Entity\Catalogue\Piste;

use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Doctrine\DBAL\Exception\ConstraintViolationException;

class ApiRestController extends AbstractController
{
	private $entityManager;
	private $logger;
	
	public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)  {
		$this->entityManager = $entityManager;
		$this->logger = $logger;
	}
	
    #[Route('/wp-json/wc/v3/products', name: 'list-all-products', methods: ['GET'])]
    public function listAllProducts(): Response
    {
        // $query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a");
		// $articles = $query->getArrayResult();
		// $response = new Response() ;
		// $response->setStatusCode(Response::HTTP_OK); // 200 https://github.com/symfony/http-foundation/blob/5.4/Response.php
		// $response->setContent(json_encode($articles)) ;
        // $response->headers->set('Content-Type', 'application/json');
        // return $response ;
    }

    #[Route('/wp-json/wc/v3/products', name: 'create-a-product', methods: ['POST'])]
    public function createAProduct(Request $request): Response
    {
		
    }

    #[Route('/wp-json/wc/v3/products/{id}', name: 'retrieve-a-product', methods: ['GET'])]
    public function retrieveAProduct(string $id): Response
    {

		//$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a where a.id like :id");
	
    }
	
	#[Route('/wp-json/wc/v3/products/{id}', name: 'modify-a-product', methods: ['PUT'])]
    public function modifyAProduct(string $id, Request $request): Response
    {
		
    }
}
