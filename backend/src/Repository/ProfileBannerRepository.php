<?php

namespace App\Repository;

use App\Entity\ProfileBanner;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @extends ServiceEntityRepository<Game>
 */
class ProfileBannerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProfileBanner::class);
    }

    /**
     * Récupère toutes les parties terminées d'un utilisateur.
     *
     * @return ProfileBanner[]
     */
    public function getAllBanners(): array
    {
        return $this->findAll();
    }

    /**
     * Récupère tous les utilisateurs ayant une bannière donnée.
     *
     * @param int $bannerId
     * @return User[]
     */
    public function getPlayersByBanner(int $bannerId): array
    {
        return $this->createQueryBuilder('pb')
            ->select('u')
            ->join('pb.users', 'u')
            ->where('pb.id = :id')
            ->setParameter('id', $bannerId)
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère une bannière par son identifiant.
     *
     * @param int $id
     * @return ProfileBanner|null
     */
    public function getBannerById(int $id): ?ProfileBanner
    {
        return $this->createQueryBuilder('pb')
            ->where('pb.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
