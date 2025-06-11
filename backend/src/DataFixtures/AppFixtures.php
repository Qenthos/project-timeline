<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Instrument;
use App\Entity\Game;
use App\Entity\User;
use App\Entity\ProfileBanner;
use App\Entity\ProfilePicture;

use App\Repository\CategoryRepository;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = __DIR__ . '\generateJSON\instruments.json';
        $usersPath = __DIR__ . '\generateJSON\users.json';

        if (!file_exists($jsonPath)) {
            throw new \Exception("Le fichier JSON des instruments est introuvable à l'emplacement : $jsonPath");
        }

        $jsonContent = file_get_contents($jsonPath);
        $instrumentsData = json_decode($jsonContent, true);

        $jsonContent2 = file_get_contents($usersPath);
        $usersData = json_decode($jsonContent2, true);

        // Table de correspondance des catégories
        $categories = [];
        $users = [];
        $profileBanners = [];
        $profilePicture = [];

        // Création de Bannières
        for ($i = 1; $i <= 11; $i++) {
            $banner = new ProfileBanner();
            $banner->setName("Banner$i");
            $banner->setImage("path$i");

            $manager->persist($banner);
            $profileBanners[] = $banner;
        }   
        
        // Création de PFP
        for ($i = 1; $i <= 11; $i++) {
            $pp = new ProfilePicture();
            $pp->setName("PFP$i");
            $pp->setImage("path$i");

            $manager->persist($pp);
            $profilePicture[] = $pp;
        } 

        // Création de 10 catégories
        for ($i = 1; $i <= 10; $i++) {
            $categorie = new Category("Categorie$i");
            $categorie
                ->setDescription("Description fictive de la catégorie $i. C’est un genre d’instrument ou de jeu particulier, souvent utilisé dans les concours !")
                ->setImage("image$i"); 
            $manager->persist($categorie);
            $categories[] = $categorie;
        }

        foreach ($usersData as $index=>$data) {
            $user = new User();
            $user->setUsername($data["pseudo"])
                 ->setPassword($data["password"])
                 ->setEmail($data["email"])
                 ->setScore($data["score"])
                 ->setProfilePicture($profilePicture[$index])
                 ->setAdmin($data["admin"])
                 ->setProfileBanner($profileBanners[$index])
                 ->setPlayedGames($data["playedGames"])
                 ->setElo($data["elo"]);

                 $users[] = $user;
            $manager->persist($user);
        }


        // Création de 10 utilisateurs
        // for ($i = 1; $i <= 10; $i++) {
        //     $user = new User();
        //     $user->setPseudo("Joueur_$i")
        //         ->setPassword("hashed_password_$i") // à adapter selon encodage réel
        //         ->setEmail("joueur$i@example.com")
        //         ->setScore(rand(0, 1000))
        //         ->setProfilePicture($profilePicture[$i])
        //         ->setAdmin(false)
        //         ->setProfileBanner($profileBanners[$i])
        //         ->setPlayedGames(rand(0, 50))
        //         ->setElo(rand(800, 2400));
        //     $manager->persist($user);
        //     $users[] = $user;
        // }

        // Création de 30 parties aléatoires
        for ($i = 1; $i <= 30; $i++) {
            $game = new Game();
            $game->setComplete((bool)rand(0, 1))
                ->setScore(rand(100, 1000))
                ->setNbBad(rand(1, 10))
                ->setTimer(rand(30, 300))
                ->setNbCards(rand(8, 50))
                ->setDifficulty(rand(1, 5))
                ->setTime(new \DateTime(sprintf('-%d days', rand(0, 100))))
                ->setPlayer($users[array_rand($users)])
                ->setCategorie($categories[array_rand($categories)]);

            $manager->persist($game);
        }

        foreach ($instrumentsData as $index=>$data) {
            $categoryName = $data['category'];

            // On évite de recréer la même catégorie plusieurs fois
            if (!isset($categories[$categoryName])) {
                $category = $categories[$index];
                $category->setName($categoryName);
                $category->setDescription("description de la catégorie en question");
                $category->setImage("chemin d'accès vers l'image en question");
                $manager->persist($category);
                $categories[$categoryName] = $category;
            }

            $instrument = new Instrument();
            $instrument->setName($data['name']);
            $instrument->setCategorie($categories[$categoryName]);
            $instrument->setImage($data['image']);
            $instrument->setCreated((int) $data['created']);
            $instrument->setWeight((int) $data['weight_kg']);
            $instrument->setHeight((int) $data['height_cm']);
            $instrument->setOrigine($data['origine']);
            $instrument->setDescription($data['description']);
            $instrument->setAnecdote($data['anecdote']);

            var_dump($instrument);
            $manager->persist($instrument);
        }

        $manager->flush();
    }
}