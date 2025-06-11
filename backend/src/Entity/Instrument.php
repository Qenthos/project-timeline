<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Query\Expr\Func;
use Symfony\Config\Framework\WebLinkConfig;

#[ORM\Entity]
class Instrument
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(length: 50)]
    private string $name;

    #[ORM\Column(type: 'string')]
    private $image;

    #[ORM\Column(type: 'integer')]
    private int $created;

    #[ORM\Column(type: 'integer')]
    private int $weight_kg;

    #[ORM\Column(type: 'integer')]
    private int $height_cm;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column(type: 'text')]
    private string $anecdote;

    #[ORM\Column(type: 'text')]
    private string $origine;

    #[ORM\ManyToOne(targetEntity: Categorie::class, inversedBy: 'instruments')]
    #[ORM\JoinColumn(nullable: false)]
    private Categorie $categorie;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function setImage($image): self
    {
        $this->image = $image;
        return $this;
    }

    public function getCreated(): int
    {
        return $this->created;
    }

    public function setCreated(int $year): self
    {
        $this->created = $year;
        return $this;
    }

    public function getCreatedDate(): \DateTime
{
    return (new \DateTime())->setTimestamp($this->created);
}


    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getAnecdote(): string
    {
        return $this->anecdote;
    }

    public function setAnecdote(string $anecdote): self
    {
        $this->anecdote = $anecdote;
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

    public function getWeight() {
        return $this->weight_kg;
    }

    public function setWeight($weight) {
        $this->weight_kg = $weight;
        return $this; 
    }

    public function getHeight() {
        return $this->height_cm;
    }

    public function setHeight($height) {
        $this->height_cm = $height;
        return $this;
    }

    public function getOrigine() {
        return $this->origine;
    }

    public function setOrigine($origine) {
        $this->origine = $origine;
        return $this;
    }

}
