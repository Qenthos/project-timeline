<?php

namespace App\Repository;

use App\Entity\ProfilePicture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @extends ServiceEntityRepository<Game>
 */
class ProfilePictureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProfilePicture::class);
    }

    /**
     * Récupère toutes les parties terminées d'un utilisateur.
     *
     * @return ProfilePicture[]  
     */
    public function getAllPFP(): array
    {
        return $this->findAll();
    }

    /**
     * Récupère tous les utilisateurs ayant une bannière donnée.
     *
     * @param int $bannerId
     * @return User[]
     */
    public function getPlayersByPicture(int $pictureId): array
    {
        return $this->createQueryBuilder('pb')
            ->select('u')
            ->join('pb.users', 'u')
            ->where('pb.id = :id')
            ->setParameter('id', $pictureId)
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère une bannière par son identifiant.
     *
     * @param int $id
     * @return ProfilePicture|null
     */
    public function getPictureById(int $id): ? ProfilePicture
    {
        return $this->createQueryBuilder('pp')
            ->where('pp.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
