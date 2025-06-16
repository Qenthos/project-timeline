<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use phpDocumentor\Reflection\Types\Boolean;

#[ORM\Entity]
#[ORM\Table(name: '`user`')] 
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(length: 100)]
    private string $username;

    #[ORM\Column(length: 255)]
    private string $password;

    #[ORM\Column(length: 255)]
    private string $email;

    #[ORM\Column(type: 'integer')] 
    private int $score;

    #[ORM\Column(type: 'integer')]
    private int $played_games;

    #[ORM\Column(type: 'integer')]
    private int $elo;

    #[ORM\ManyToOne(targetEntity: ProfilePicture::class, inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    private ProfilePicture $profilePicture;

    #[ORM\ManyToOne(targetEntity: ProfileBanner::class, inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    private ProfileBanner $profileBanner;

    #[ORM\OneToMany(mappedBy: 'player', targetEntity: Game::class)]
    private Collection $games;

    #[ORM\Column(type: 'boolean')]
    private bool $admin;

    public function __construct()
    {
        $this->games = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $pseudo): self
    {
        $this->username = $pseudo;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
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

    public function getPlayedGames(): int
    {
        return $this->played_games;
    }

    public function setPlayedGames(int $played_games): self
    {
        $this->played_games = $played_games;
        return $this;
    }

    public function getElo(): int
    {
        return $this->elo;
    }

    public function setElo(int $elo): self
    {
        $this->elo = $elo;
        return $this;
    }

    public function getAdmin(): bool
    {
        return $this->admin;
    }

    public function setAdmin(bool $val) {
        $this->admin = $val;
        return $this;
    }

    public function isAdmin() {
        return $this->admin;
    }

    public function getProfilePicture(): ProfilePicture
    {
        return $this->profilePicture;
    }


    public function setProfilePicture(ProfilePicture $profilePicture): self
    {
        $this->profilePicture = $profilePicture;
        return $this;
    }

    public function getProfileBanner(): ProfileBanner
    {
        return $this->profileBanner;
    }

    public function setProfileBanner(ProfileBanner $profileBanner): self
    {
        $this->profileBanner = $profileBanner;
        return $this;
    }

    public function getGames(): Collection
    {
        return $this->games;
    }

    public function addGame(Game $game): self
    {
        if (!$this->games->contains($game)) {
            $this->games[] = $game;
            $game->setPlayer($this);
        }
        return $this;
    }

    public function removeGame(Game $game, EntityManager $entityManager): self
    {
        if ($this->games->removeElement($game)) {
            if ($game->getPlayer() === $this) {
                $entityManager->remove($game);
            }
        }
        return $this;
    }

}
