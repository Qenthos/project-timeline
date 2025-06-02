<?php

namespace App\Repository;

use App\Entity\Categorie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @extends ServiceEntityRepository<Categorie>
 *
 * @method Categorie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Categorie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Categorie[]    findAll()
 * @method Categorie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategorieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Categorie::class);
    }

    /**
     * Retourne toutes les catégories triées par nom (ordre alphabétique)
     *
     * @return Categorie[]
     */
    public function getAllCategories(): array
    {
        return $this->createQueryBuilder('c')
            ->select("c.id, c.name, c.description, c.image")
            ->getQuery()
            ->getResult();
    }


    /**
     * Retourne toutes les catégories triées par nom (ordre alphabétique)
     *
     * @return Categorie[]
     */
    public function getAllCategoriesSortedByName(): array
    {
        return $this->createQueryBuilder('c')
            ->orderBy('c.nom', 'ASC') // ou 'c.name' selon ton champ
            ->getQuery()
            ->getResult();
    }

    /**
     * Retourne une catégorie par son slug (ou autre identifiant unique)
     *
     * @param string $name
     * @return Categorie|null
     */
    public function findOneByName(string $name): ?Categorie
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Retourne toutes les catégories visibles
     *
     * @return Categorie[]
     */
    public function findVisibleCategories(): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.visible = true') // Si tu as un booléen "visible"
            ->orderBy('c.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche de catégories par mot-clé
     *
     * @param string $search
     * @return Categorie[]
     */
    public function searchCategories(string $search): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.nom LIKE :search') // ou 'c.name'
            ->setParameter('search', '%' . $search . '%')
            ->orderBy('c.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
