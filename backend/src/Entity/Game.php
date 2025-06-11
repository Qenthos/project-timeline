<?php

namespace App\Entity;

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

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $timer = null;

    #[ORM\Column(type: 'integer')]
    private int $nbCards;

    #[ORM\Column(type: 'string')]
    private string $difficulty;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $time;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'games')]
    #[ORM\JoinColumn(nullable: false)]
    private User $player;

    public function __construct()
    {
        $this->win = false;
        $this->score = 0;
        $this->timer = 120;
        $this->nbCards = 10;
        $this->difficulty = 'normal';
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

    public function getTimer(): ?int
    {
        return $this->timer;
    }

    public function setTimer(?int $timer): self
    {
        $this->timer = $timer;
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
}

