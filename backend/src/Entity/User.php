<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
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
