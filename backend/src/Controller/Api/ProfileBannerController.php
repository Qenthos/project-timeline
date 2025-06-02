<?php

namespace App\Controller\Api;

use ApiPlatform\OpenApi\Model\Response;
use App\Entity\ProfileBanner;
use App\Repository\ProfileBannerRepository;
use COM;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class ProfileBannerController extends AbstractController
{

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route('api/banners', name: "listBanners", methods: ['GET'])]
    public function listBanners(ProfileBannerRepository $bannerRepository): JsonResponse
    {
        $banners = $bannerRepository->getAllBanners();

        $data = [];

        foreach ($banners as $banner) {

            $data[] = [
                'id' => $banner->getId(),
                'name' => $banner->getName(),
                'image' => $banner->getImage()
            ];
        }

        return $this->json($data);
    }

    #[Route('api/banner/{bannerId}', name: "getPlayersForBanner", methods: ['GET'])]
    public function listPlayerByBanner(ProfileBannerRepository $bannerRepository, int $idBanner): JsonResponse
    {
        $players = $bannerRepository->getPlayersBybanner($idBanner);

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
