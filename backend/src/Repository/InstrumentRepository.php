<?php

namespace App\Repository;

use App\Entity\Instrument;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use PhpParser\Node\Expr\FuncCall;

class InstrumentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Instrument::class);
    }

    public function findAllInstruments(): array
    {
        return $this->findAll();
    }

    public function getInstrumentById(int $id)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.id = :instrId')
            ->setParameter('instrId', $id)
            ->getQuery()
            ->getResult();
    }

    public function getInstrumentRandom(int $count): array
    {
        $allIds = $this->createQueryBuilder('i')
            ->select('i.id')
            ->getQuery()
            ->getScalarResult();

        $idList = array_column($allIds, 'id');
        shuffle($idList);
        $randomIds = array_slice($idList, 0, $count);

        return $this->createQueryBuilder('i')
            ->where('i.id IN (:ids)')
            ->setParameter('ids', $randomIds)
            ->getQuery()
            ->getResult();
    }
}
