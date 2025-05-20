<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;

#[ORM\Entity]
class User {
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private string $pseudo;

    #[ORM\Column]
    private string $mdp;

    #[ORM\Column]
    private string $mail;

    #[ORM\Column(nullable: true)]
    private ?string $profilPicture = null;

    #[ORM\Column(nullable: true)]
    private ?string $profilBanner = null;

    #[ORM\Column]
    private int $score;

    #[ORM\Column]
    private int $playedGames;

    #[ORM\Column]
    private int $elo;

    #[ORM\OneToMany(mappedBy: "player", targetEntity: Game::class)]
    private Collection $games;
}
