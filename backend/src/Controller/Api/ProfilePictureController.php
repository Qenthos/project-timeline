<?php

namespace App\Controller\Api;

use ApiPlatform\OpenApi\Model\Response;
use App\Entity\ProfilePicture;
use App\Repository\ProfilePictureRepository;
use COM;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class ProfilePictureController extends AbstractController
{

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route('api/pictures', name: "listPictures", methods: ['GET'])]
    public function listPicture(ProfilePictureRepository $pictureRepository): JsonResponse
    {
        $pictures = $pictureRepository->getAllPFP();

        $data = [];

        foreach ($pictures as $pic) {

            $data[] = [
                'id' => $pic->getId(),
                'name' => $pic->getName(),
                'image' => '/media/profile-pictures/' . $pic->getImage()
            ];
        }

        return $this->json($data);
    }

    #[Route('api/pictures/{bannerId}', name: "getPlayersForPicture", methods: ['GET'])]
    public function listPlayerByPicture(ProfilePictureRepository $pictureRepository, int $idPicture): JsonResponse
    {
        $players = $pictureRepository->getPlayersByPicture($idPicture);

        $data = [];

        foreach ($players as $user) {

            $data[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'created' => $user->getCreated(),
                'weight' => $user->getWeight(),
                'height' => $user->getHeight(),
                'origine' => $user->getOrigine(),
                'description' => $user->getDescription(),
                'anecdote' => $user->getAnecdote(),
                'categorie' => $user->getCategorie()->getName(),
            ];
        }

        return $this->json($data);
    }
}
