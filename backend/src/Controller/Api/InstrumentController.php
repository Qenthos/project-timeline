<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Response as Reponse;
use ApiPlatform\OpenApi\Model\Response;
use App\Entity\Instrument;
use App\Repository\InstrumentRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class InstrumentController extends AbstractController
{

    private $loggerInterface;
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->loggerInterface = $logger;
    }

    #[Route(
        path: '/{path}',
        name: 'options_preflight',
        methods: ['OPTIONS'],
        requirements: ['path' => '.+']
    )]
    public function optionsPreflight(): Reponse
    {
        return new Reponse('', 204, [
            'Access-Control-Allow-Origin' => 'http://localhost:5173',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        ]);
    }

    #[Route('api/instruments', name: "listInstruments", methods: ['GET'])]
    public function listInstruments(InstrumentRepository $instrumentsRepository): JsonResponse
    {
        $instruments = $instrumentsRepository->findAllInstruments();

        $data = [];

        foreach ($instruments as $instrument) {

            $data[] = [
                'id' => $instrument->getId(),
                'name' => $instrument->getName(),
                'image' => $instrument->getImage(),
                'created' => $instrument->getCreated(),
                'weight' => (float) $instrument->getWeight(),
                'height' => (float) $instrument->getHeight(),
                'origine' => $instrument->getOrigine(),
                'description' => $instrument->getDescription(),
                'anecdote' => $instrument->getAnecdote(),
                'category' => $instrument->getCategorie()->getName(),
            ];
        }

        return $this->json($data);
    }

    #[Route('api/instruments/{id}', name: "getInstrumentById", methods: ['GET'])]
    public function getInstrumentById(InstrumentRepository $instrumentsRepository, int $id): JsonResponse
    {
        $instruments = $instrumentsRepository->getInstrumentById($id);

        $data = [];

        foreach ($instruments as $instrument) {

            $data[] = [
                'id' => $instrument->getId(),
                'name' => $instrument->getName(),
                'image' => $instrument->getImage(),
                'created' => $instrument->getCreated(),
                'weight' => (float) $instrument->getWeight(),
                'height' => (float) $instrument->getHeight(),
                'origine' => $instrument->getOrigine(),
                'description' => $instrument->getDescription(),
                'anecdote' => $instrument->getAnecdote(),
                'categorie' => $instrument->getCategorie()->getName(),
            ];
        }

        return $this->json($data);
    }


    #[Route('api/instruments/random/{count}', name: "getInstrumentsRandom", methods: ['GET'])]
    public function getInstrumentsRandom(InstrumentRepository $instrumentsRepository, int $count): JsonResponse
    {
        $instruments = $instrumentsRepository->getInstrumentRandom($count);

        $data = [];

        foreach ($instruments as $instrument) {

            $data[] = [
                'id' => $instrument->getId(),
                'name' => $instrument->getName(),
                'image' => $instrument->getImage(),
                'created' => $instrument->getCreated(),
                'weight' => (float) $instrument->getWeight(),
                'height' => (float) $instrument->getHeight(),
                'origine' => $instrument->getOrigine(),
                'description' => $instrument->getDescription(),
                'anecdote' => $instrument->getAnecdote(),
                'categorie' => $instrument->getCategorie()->getName(),
            ];
        }

        return $this->json($data);
    }

    #[Route('api/instruments', name: "addInstrument", methods: ['POST'])]
    public function addInstrument(Request $request, InstrumentRepository $instrumentRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $instrument = new Instrument();
        $instrument->setName($data['name'] ?? '');
        $instrument->setCreated($data['created'] ?? null);
        if (isset($data['weight'])) {
            $instrument->setWeight((float) $data['weight']);
        }
        
        if (isset($data['height'])) {
            $instrument->setHeight((float) $data['height']);
        }
        
        $instrument->setOrigine($data['origine'] ?? '');
        $instrument->setDescription($data['description'] ?? '');
        $instrument->setAnecdote($data['anecdote'] ?? '');

        $categorie = $this->entityManager->getRepository(\App\Entity\Category::class)->find($data['categorie_id']);
        if (!$categorie) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }
        $instrument->setCategorie($categorie);

        $this->entityManager->persist($instrument);
        $this->entityManager->flush();

        return $this->json(['message' => 'Instrument ajouté avec succès', 'id' => $instrument->getId()], 201);
    }

    #[Route('api/instruments/{id}', name: "editInstrument", methods: ['PUT', 'PATCH'])]
    public function editInstrument(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $instrument = $this->entityManager->getRepository(Instrument::class)->find($id);

        if (!$instrument) {
            return $this->json(['error' => 'Instrument non trouvé'], 404);
        }

        if (isset($data['name'])) $instrument->setName($data['name']);
        if (isset($data['created'])) $instrument->setCreated(intval($data['created']));
        if (isset($data['weight'])) $instrument->setWeight((float)($data['weight']));
        if (isset($data['height'])) $instrument->setHeight((float)($data['height']));
        if (isset($data['origine'])) $instrument->setOrigine($data['origine']);
        if (isset($data['description'])) $instrument->setDescription($data['description']);
        if (isset($data['anecdote'])) $instrument->setAnecdote($data['anecdote']);

        if (isset($data['categorie_id'])) {
            $categorie = $this->entityManager->getRepository(\App\Entity\Category::class)->find($data['categorie_id']);
            if ($categorie) {
                $instrument->setCategorie($categorie);
            }
        }

        $this->entityManager->flush();

        return $this->json(['message' => 'Instrument mis à jour avec succès']);
    }


    #[Route('api/instruments/{id}', name: "deleteInstrument", methods: ['DELETE'])]
    public function deleteInstrument(int $id): JsonResponse
    {
        $instrument = $this->entityManager->getRepository(Instrument::class)->find($id);

        if (!$instrument) {
            return $this->json(['error' => 'Instrument non trouvé'], 404);
        }

        $this->entityManager->remove($instrument);
        $this->entityManager->flush();

        return $this->json(['message' => 'Instrument supprimé avec succès']);
    }
}
