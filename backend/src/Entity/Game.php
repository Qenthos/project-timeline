<?php

namespace App\Entity;

use App\Entity\Categorie;
use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use phpDocumentor\Reflection\Types\Boolean;

#[ORM\Entity]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'boolean')]
    private bool $complete;

    #[ORM\Column(type: 'integer')]
    private int $score;

    #[ORM\Column(type: 'integer')]
    private int $nb_try;

    #[ORM\Column(type: 'integer')]
    private int $nb_rounds;

    #[ORM\Column(type: 'integer')]
    private int $timer;

    #[ORM\Column(type: 'integer')]
    private int $nb_cards;

    #[ORM\Column(type: 'integer')]
    private int $difficulty;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $time;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'games')]
    #[ORM\JoinColumn(nullable: false)]
    private User $player;

    #[ORM\ManyToOne(targetEntity: Categorie::class, inversedBy: 'games')]
    #[ORM\JoinColumn(nullable: false)]
    private Categorie $categorie;

    public function __construct() {
        $this->complete = false;
        $this->score = 0; 
        $this->nb_try = 0;
        $this->timer = 120;
        $this->nb_cards = 10;
        $this->difficulty = 2;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function isComplete(): bool
    {
        return $this->complete;
    }

    public function setComplete(bool $complete): self
    {
        $this->complete = $complete;
        return $this;
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setScore(int $score): self
    {
        $this->score = $score;
        return $this;
    }

    public function getNbTry(): int
    {
        return $this->nb_try;
    }

    public function setNbTry(int $nb_try): self
    {
        $this->nb_try = $nb_try;
        return $this;
    }

    public function getNbRounds(): int
    {
        return $this->nb_rounds;
    }

    public function setNbRounds(int $nb_rounds): self
    {
        $this->nb_rounds = $nb_rounds;
        return $this;
    }

    public function getTimer(): int
    {
        return $this->timer;
    }

    public function setTimer(int $timer): self
    {
        $this->timer = $timer;
        return $this;
    }

    public function getNbCards(): int
    {
        return $this->nb_cards;
    }

    public function setNbCards(int $nb_cards): self
    {
        $this->nb_cards = $nb_cards;
        return $this;
    }

    public function getDifficulty(): int
    {
        return $this->difficulty;
    }

    public function setDifficulty(int $difficulty): self
    {
        $this->difficulty = $difficulty;
        return $this;
    }

    public function getTime(): \DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): self
    {
        $this->time = $time;
        return $this;
    }

    public function getPlayer(): User
    {
        return $this->player;
    }

    public function setPlayer(User $player): self
    {
        $this->player = $player;
        return $this;
    }

    public function getCategorie(): Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(Categorie $categorie): self
    {
        $this->categorie = $categorie;
        return $this;
    }
}
