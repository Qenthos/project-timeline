<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getCosmeticsByUser($id): ?User
    {
        return $this->createQueryBuilder('c')
            ->join('c.profilePicture', 'pp') // ou join si c'est obligatoire
            ->addSelect('pp')
            ->leftJoin('c.profileBanner', 'pb')
            ->addSelect('pb')
            ->andWhere('c.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getSingleResult();
    }

    public function getAllUsers(): array
    {
        return $this->findAll();
    }

    public function isAdmin($id)
    {
        return $this->createQueryBuilder('u')
            ->select('u.admin')
            ->setParameter('id', $id)
            ->andWhere('u.id = :id')
            ->getQuery()
            ->getSingleResult();
    }

    public function getAllAdmins(): array
    {
        return $this->createQueryBuilder('u')
            ->select("u.id, u.pseudo, u.email, u.password")
            ->andWhere('u.admin = :isAdmin')
            ->setParameter('isAdmin', true)
            ->getQuery()
            ->getResult();
    }
}
