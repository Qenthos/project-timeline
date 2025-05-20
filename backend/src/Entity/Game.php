<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;

#[ORM\Entity]
class Game {
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private int $score;

    #[ORM\Column]
    private int $complete;

    #[ORM\Column]
    private int $nbTry;

    #[ORM\Column]
    private string $mode;

    #[ORM\Column]
    private bool $finished;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "games")]
    private ?User $player = null;
}

