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
use Symfony\Component\Validator\Constraints\Length;

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
        $gamemode = ["poids", "taille", "création"];

        // Création de Bannières
        for ($i = 1; $i <= 2; $i++) {
            $banner = new ProfileBanner();
            $banner->setName("Banner$i");
            $banner->setImage("wallpaper-$i.webp");

            $manager->persist($banner);
            $profileBanners[] = $banner;
        }

        // Création de PFP
        for ($i = 1; $i <= 3; $i++) {
            $pp = new ProfilePicture();
            $pp->setName("PFP$i");
            $pp->setImage("pdp-$i.webp");

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

        $categorie = new Category("noCategory");
        $categorie
            ->setDescription("pas de categorie")
            ->setImage("non_image");
        $manager->persist($categorie);

        foreach ($usersData as $index => $data) {
            $user = new User();
            $user->setUsername($data["username"])
                ->setPassword($data["password"])
                ->setEmail($data["email"])
                ->setScore($data["score"])
                ->setProfilePicture($profilePicture[array_rand($profilePicture)])
                ->setAdmin($data["admin"])
                ->setProfileBanner($profileBanners[array_rand($profileBanners)])
                ->setPlayedGames($data["playedGames"])
                ->setGamesWon($data["gamesWon"] ?? 0)
                ->setGamesLost($data["gamesLost"] ?? 0)
                ->setElo($data["elo"]);



            $users[] = $user;
            $manager->persist($user);
        }


        // Création de 30 parties aléatoires
        for ($i = 1; $i <= 30; $i++) {
            $game = new Game();
            $game->setWin((bool)rand(0, 1))
                ->setScore(rand(100, 1000))
                ->setNbBad(rand(1, 10))
                ->setGamemode($gamemode[rand(0, sizeof($gamemode) - 1)])
                ->setTimer(rand(30, 300))
                ->setNbCards(rand(8, 50))
                ->setDifficulty(['easy', 'normal', 'hard'][array_rand(['easy', 'normal', 'hard'])])
                ->setTime(new \DateTime(sprintf('-%d days', rand(0, 100))))
                ->setPlayer($users[array_rand($users)])
                ->setCategorie($categories[rand(0, 9)]);

            $manager->persist($game);
        }

        foreach ($instrumentsData as $index => $data) {
            $categoryName = $data['category'];

            // On évite de recréer la même catégorie plusieurs fois
            if (!isset($categories[$categoryName])) {
                $category = new Category($categoryName);
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
            $instrument->setWeight((float) $data['weight_kg']);
            $instrument->setHeight((float) $data['height_cm']);
            $instrument->setOrigine($data['origine']);
            $instrument->setDescription($data['description']);
            $instrument->setAnecdote($data['anecdote']);

            var_dump($instrument);
            $manager->persist($instrument);
        }

        $manager->flush();
    }
}
