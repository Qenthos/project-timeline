<?php

namespace App\Controller\Api;

use ApiPlatform\OpenApi\Model\Response;
use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use COM;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class CategoriesController extends AbstractController
{

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route('api/categories', name: "listCategories", methods: ['GET'])]
    public function listCategories(CategorieRepository $categoriesRepository): JsonResponse
    {
        $categories = $categoriesRepository->getAllCategories();
        return $this->json($categories);
    }

   
}
