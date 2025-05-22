<?php

namespace App\Controller\Api;

use ApiPlatform\OpenApi\Model\Response;
use App\Repository\GameRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class GameController extends AbstractController {

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route('api/user/{id}/games', name: "game", methods: ['GET'])]
    public function listPlayerGames(GameRepository $gameRepository, int $id) : JsonResponse{
          
        $games = $gameRepository->findAllGamesByUser($id);

        return $this->json($games);
    
    }

}