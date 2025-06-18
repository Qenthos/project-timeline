<?php

namespace App\Controller\Api;

use ApiPlatform\OpenApi\Model\Response;
use App\Entity\User;
use App\Repository\ProfileBannerRepository;
use App\Repository\ProfilePictureRepository;
use App\Repository\UserRepository;
use COM;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;


class UserController extends AbstractController
{

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route('api/users', name: "listUsers", methods: ['GET'])]
    public function listUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->getAllUsers();

        $data = [];

        foreach ($users as $user) {

            $data[] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword(),
                'profilePicture' => $user->getProfilePicture()->getId(),
                'bannerImage' => $user->getProfileBanner()->getId(),
                'score' => $user->getScore(),
                'played_games' => $user->getPlayedGames(),
                'elo' => $user->getElo()
            ];
        }

        return $this->json($data);
    }

    #[Route('api/user/{id}', name: 'getUserById', methods: ['GET'])]
    public function getUserById(int $id, UserRepository $userRepo): JsonResponse
    {
        $user = $userRepo->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'score' => $user->getScore(),
            'elo' => $user->getElo(),
            'played_games' => $user->getPlayedGames(),
            'pfp' => $user->getProfilePicture()?->getId(),
            'pfb' => $user->getProfileBanner()?->getId(),
        ]);
    }


    #[Route('api/user/cosmetics/{id}', name: "CosmeticsByUser", methods: ['GET'])]
    public function getCosmeticsByUser(UserRepository $userRepository, int $id): JsonResponse
    {
        $user = $userRepository->getCosmeticsByUser($id);

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'profilePicture' => [
                'id' => $user->getProfilePicture()->getId(),
                'name' => $user->getProfilePicture()->getName(),
                'image' => $user->getProfilePicture()->getImage(),
            ],
            'profileBanner' => [
                'id' => $user->getProfileBanner()->getId(),
                'name' => $user->getProfileBanner()->getName(),
                'image' => $user->getProfileBanner()->getImage(),
            ],
        ]);
    }

    #[Route('api/user/isAdmin/{id}', name: "idAdmin", methods: ['GET'])]
    public function isAdmin(UserRepository $userRepository, int $id): JsonResponse
    {
        return $this->json($userRepository->isAdmin($id));
    }

    #[Route('api/user/admin/list', name: "listAdmin", methods: ['GET'])]
    public function listAdmin(UserRepository $userRepository): JsonResponse
    {
        return $this->json($userRepository->getAllAdmins());
    }

    // AJOUT 

    #[Route('api/user', name: 'createUser', methods: ['POST'])]
    public function createUser(Request $request, ProfileBannerRepository $PBrep, ProfilePictureRepository $PPrep): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $user = new User();
        $user->setUsername($data['username'] ?? null);
        $user->setEmail($data['email'] ?? null);
        $user->setPassword($data['password'] ?? null);
        $user->setScore($data['score'] ?? 0);
        $user->setPlayedGames($data['played_games'] ?? 0);
        $user->setAdmin($data['admin'] ?? false);
        $user->setProfileBanner($PBrep->getBannerById($data['pfb'] ?? 1));
        $user->setProfilePicture($PPrep->getPictureById($data['pfp'] ?? 1));
    
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    
        $responseData = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'score' => $user->getScore(),
            'played_games' => $user->getPlayedGames(),
            'elo' => $user->getElo(),
            'admin' => $user->getAdmin(),
            'pfp' => $user->getProfilePicture()->getId(),
            'pfb' => $user->getProfileBanner()->getId(),  
        ];
    
        return $this->json($responseData, 201);
    }
    

    #[Route('api/user/{id}', name: 'updateUser', methods: ['PUT', 'PATCH'])]
    public function updateUser(int $id, Request $request, UserRepository $userRepo, ProfilePictureRepository $pfpRepo, ProfileBannerRepository $pfbRepo): JsonResponse
    {
        $user = $userRepo->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $user->setPassword($data['password']);
        }
        if (isset($data['score'])) {
            $user->setScore($data['score']);
        }
        if (isset($data['score']) && isset($data['played_games'])) {
            $user->setElo(($data['score'] / $data['played_games']) * 1000);
        }

        if (isset($data['pfp'])) {
            $pfp = $pfpRepo->find($data['pfp']);
            if ($pfp) {
                $user->setProfilePicture($pfp);
            } else {
                return $this->json(['error' => 'Profile picture not found'], 400);
            }
        }

        if (isset($data['played_games'])) {
            $user->setPlayedGames($data['played_games']);
        }
    
        if (isset($data['pfb'])) {
            $pfb = $pfbRepo->find($data['pfb']);
            if ($pfb) {
                $user->setProfileBanner($pfb);
            } else {
                return $this->json(['error' => 'Profile banner not found'], 400);
            }
        }

        $this->entityManager->flush();

        return $this->json(['message' => 'Utilisateur mis à jour']);
    }

    // DELETEE

    #[Route('api/user/{id}', name: 'deleteUser', methods: ['DELETE'])]
    public function deleteUser(int $id, UserRepository $userRepo): JsonResponse
    {
        $user = $userRepo->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'Utilisateur supprimé 🗑️']);
    }
}
