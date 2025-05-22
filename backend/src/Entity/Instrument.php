<?php

namespace App\Entity;

use App\Repository\InstrumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InstrumentRepository::class)]
class Instrument {
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private string $nom;

    #[ORM\Column]
    private string $categorie;

    #[ORM\Column]
    private string $dateCreation;

    #[ORM\Column]
    private string $origine;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column]
    private string $familleCulturelle;

    #[ORM\Column(type: 'text')]
    private string $anecdote;
}
