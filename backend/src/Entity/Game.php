<?php

namespace App\Entity;

use App\Entity\Category;
use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'boolean')]
    private bool $win;

    #[ORM\Column(type: 'integer')]
    private int $score;

    #[ORM\Column(type: 'integer')]
    private int $nb_bad;

    #[ORM\Column(type: 'integer')]
    private int $timer;

    #[ORM\Column(type: 'integer')]
    private int $time_elapsed;

    #[ORM\Column(type: 'integer')]
    private int $nbCards;

    #[ORM\Column(type: 'string')]
    private string $difficulty;

    #[ORM\Column(type: 'string')]
    private string $gamemode;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $time;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'games')]
    #[ORM\JoinColumn(nullable: false)]
    private User $player;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'games')]
    #[ORM\JoinColumn(nullable: false)]
    private Category $categorie;

    public function __construct() {
        $this->win = false;
        $this->time_elapsed = 0;
        $this->score = 0; 
        $this->nb_bad = 0;
        $this->timer = 120;
        $this->nbCards = 10;
        $this->difficulty = 'normal';
        $this->gamemode = 'poids';
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function isWin(): bool
    {
        return $this->win;
    }

    public function setWin(bool $win): self
    {
        $this->win = $win;
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

    public function getNbBad(): int
    {
        return $this->nb_bad;
    }

    public function setNbBad(int $nb_bad): self
    {
        $this->nb_bad = $nb_bad;
        return $this;
    }

    public function getTimer(): int
    {
        return $this->timer;
    }

    public function setTimer(?int $timer): self
    {
        $this->timer = $timer;
        return $this;
    }

    public function getTimeElapsed() 
    {
        return $this->time_elapsed;    
    }

    public function setTimeElapsed(int $time) 
    {
        $this->time_elapsed = $time;
        return $this;
    }

    public function getNbCards(): int
    {
        return $this->nbCards;
    }

    public function setNbCards(int $nbCards): self
    {
        $this->nbCards = $nbCards;
        return $this;
    }

    public function getDifficulty(): string
    {
        return $this->difficulty;
    }

    public function setDifficulty(string $difficulty): self
    {
        $this->difficulty = $difficulty;
        return $this;
    }

    public function getGamemode(): string
    {
        return $this->gamemode;
    }

    public function setGamemode(string $mode): self
    {
        $this->gamemode = $mode;
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

    public function getCategorie(): Category
    {
        return $this->categorie;
    }

    public function setCategorie(Category $categorie): self
    {
        $this->categorie = $categorie;
        return $this;
    }
}
