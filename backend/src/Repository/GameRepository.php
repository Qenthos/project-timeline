<?php

namespace App\Repository;

use App\Entity\Game;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Game>
 */
class GameRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Game::class);
    }

    /**
     * Récupère toutes les parties de l'application
     *
     * @return Game[]
     */
    public function findAllGames(): array
    {
         return $this->createQueryBuilder('g')
        ->select('g.id, g.complete, g.score, g.nb_bad, g.timer, g.time_elapsed, g.nb_cards, g.difficulty, g.gamemode, g.time')
        ->addSelect('cat.name AS categoryName')
        ->addSelect('player.id AS playerId')
        ->leftJoin('g.categorie', 'cat') 
        ->leftJoin('g.player', 'player') 
        ->getQuery()
        ->getArrayResult(); 
    }


    /**
     * Récupère toutes les parties terminées d'un utilisateur.
     *
     * @param int $userId
     * @return Game[]
     */
    public function findFinishedGamesByUser(int $userId): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.finished = true')
            ->andWhere('g.player = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère toutes les parties d'un utilisateur sous forme de tableau associatif.
     *
     * @param int $userId
     * @return array
     */
    public function findAllGamesByUser(int $userId): array
    {
        return $this->createQueryBuilder('g')
            // Suppression de la jointure avec la catégorie
            ->andWhere('g.player = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getArrayResult();
    }

    /**
     * Récupère une partie spécifique par son ID et l'ID du joueur.
     *
     * @param int $gameId
     * @param int $userId
     * @return Game|null
     */
    public function findGameByIdAndUser(int $gameId, int $userId): ?Game
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.id = :gameId')
            ->andWhere('g.player = :userId')
            ->setParameter('gameId', $gameId)
            ->setParameter('userId', $userId)            
            ->getQuery()
            ->getOneOrNullResult();
    }
    

    /**
     * Récupère les parties non terminées d'un utilisateur.
     *
     * @param int $userId
     * @return Game[]
     */
    public function findUnfinishedGamesByUser(int $userId): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.finished = false')
            ->andWhere('g.player = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les 10 meilleures parties d'un utilisateur, classées par score décroissant.
     *
     * @param int $userId
     * @return Game[]
     */
    public function findTopGames(int $userId): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.player = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('g.score', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }

    /**
     * Compte le nombre total de parties d'un utilisateur.
     *
     * @param int $userId
     * @return int
     */
    public function countGamesByUser(int $userId): int
    {
        return (int) $this->createQueryBuilder('g')
            ->select('COUNT(g.id)') // Correction ici aussi
            ->andWhere('g.player = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Récupère les parties d'un utilisateur triées par score décroissant.
     *
     * @param int $userId
     * @param int|null $limit Nombre maximum de résultats (optionnel)
     * @return Game[]
     */
    public function findTopGamesByUser(int $userId, ?int $limit = null): array
    {
        $qb = $this->createQueryBuilder('g')
            ->andWhere('g.player = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('g.score', 'DESC');

        if ($limit !== null) {
            $qb->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }
}
