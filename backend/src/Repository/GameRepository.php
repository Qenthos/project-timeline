<?php

namespace App\Repository;

use App\Entity\Game;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\ArrayCollection;

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
            ->select('g.game_id', 'g.score', 'g.complete', 'g.nb_try', 'g.mode', 'g.finished')
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
            ->andWhere('g.game_id = :gameId')
            ->andWhere('g.player = :userId')
            ->setParameters(new ArrayCollection([
                'gameId' => $gameId,
                'userId' => $userId,
            ]))
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
     * Compte le nombre total de parties d'un utilisateur.
     *
     * @param int $userId
     * @return int
     */
    public function countGamesByUser(int $userId): int
    {
        return (int) $this->createQueryBuilder('g')
            ->select('COUNT(g.game_id)')
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
