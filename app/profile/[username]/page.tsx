"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/ProfilePage.module.css";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { currentUser } from "@/constants/currentUser";
import { Recipe } from "@/types";
import Head from "next/head";

interface UserProfile {
  username: string;
  name: string;
  avatar: string;
  recipes: number;
  following: number;
  followers: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
  recipesList: Recipe[];
  likedList: Recipe[];
}

const mockUser: UserProfile = {
  username: "choirul",
  name: "Choirul Syafril",
  avatar: "/profile-avatar.jpg",
  recipes: 32,
  following: 782,
  followers: 1287,
  isFollowing: false,
  isCurrentUser: false,
  recipesList: [
    { 
      id: "1", 
      title: "Pancake", 
      image: "/pancake.jpg", 
      duration: ">60 mins", 
      author: {
        id: "1",
        username: "choirul",
        name: "Choirul Syafril",
        avatar: "/profile-avatar.jpg",
        email: "choirul@example.com",
        recipes: 32,
        following: 782,
        followers: 1287
      }, 
      category: "Breakfast",
      description: "Delicious fluffy pancakes",
      ingredients: ["flour", "eggs", "milk"],
      steps: [{ description: "Mix ingredients" }],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      cookingTime: "30 mins"
    },
    { 
      id: "2", 
      title: "Salad", 
      image: "/salad.jpg", 
      duration: ">60 mins", 
      author: {
        id: "1",
        username: "choirul",
        name: "Choirul Syafril",
        avatar: "/profile-avatar.jpg",
        email: "choirul@example.com",
        recipes: 32,
        following: 782,
        followers: 1287
      }, 
      category: "Lunch",
      description: "Fresh garden salad",
      ingredients: ["lettuce", "tomatoes", "cucumber"],
      steps: [{ description: "Chop vegetables" }],
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02",
      cookingTime: "15 mins"
    },
    { 
      id: "3", 
      title: "Salad", 
      image: "/salad2.jpg", 
      duration: ">60 mins", 
      author: {
        id: "1",
        username: "choirul",
        name: "Choirul Syafril",
        avatar: "/profile-avatar.jpg",
        email: "choirul@example.com",
        recipes: 32,
        following: 782,
        followers: 1287
      }, 
      category: "Lunch",
      description: "Caesar salad",
      ingredients: ["romaine", "croutons", "parmesan"],
      steps: [{ description: "Toss ingredients" }],
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03",
      cookingTime: "20 mins"
    },
    { 
      id: "4", 
      title: "Pancake", 
      image: "/pancake2.jpg", 
      duration: ">60 mins", 
      author: {
        id: "1",
        username: "choirul",
        name: "Choirul Syafril",
        avatar: "/profile-avatar.jpg",
        email: "choirul@example.com",
        recipes: 32,
        following: 782,
        followers: 1287
      }, 
      category: "Breakfast",
      description: "Blueberry pancakes",
      ingredients: ["flour", "eggs", "milk", "blueberries"],
      steps: [{ description: "Mix and add blueberries" }],
      createdAt: "2024-01-04",
      updatedAt: "2024-01-04",
      cookingTime: "35 mins"
    }
  ],
  likedList: [
    { 
      id: "5", 
      title: "Waffles", 
      image: "/waffles.jpg", 
      duration: ">60 mins", 
      author: {
        id: "1",
        username: "choirul",
        name: "Choirul Syafril",
        avatar: "/profile-avatar.jpg",
        email: "choirul@example.com",
        recipes: 32,
        following: 782,
        followers: 1287
      }, 
      category: "Breakfast",
      description: "Crispy waffles",
      ingredients: ["flour", "eggs", "milk", "butter"],
      steps: [{ description: "Mix and cook in waffle iron" }],
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05",
      cookingTime: "25 mins"
    }
  ],
};

const ProfilePage = () => {
  const { username } = useParams();
  const [tab, setTab] = useState("recipes");
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);


  // Determine if this is the current user's profile
  const isCurrentUser = username === currentUser.username;

  const handleFollow = () => setIsFollowing((prev) => !prev);


  return (
    <>
      <Head>
        <title>Chefio | Profile</title>
        <meta name="description" content={`View the profile and recipes of ${mockUser.name} on Chefio.`} />
      </Head>
      <Navbar />
      <div className={styles.profileContainer}>
        <header className={styles.header}>
          <div className={styles.avatarSection}>
            <Image
              src={mockUser.avatar}
              alt={mockUser.name}
              width={100}
              height={100}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              {isCurrentUser && (
                <div className={styles.yourProfileLabel}>Your Profile:</div>
              )}
              <h2 className={styles.name}>{mockUser.name}</h2>
              <div className={styles.stats}>
                <div>
                  <span className={styles.statNumber}>{mockUser.recipes}</span>
                  <span className={styles.statLabel}>Recipes</span>
                </div>
                <div>
                  <span className={styles.statNumber}>{mockUser.following}</span>
                  <span className={styles.statLabel}>Following</span>
                </div>
                <div>
                  <span className={styles.statNumber}>{mockUser.followers}</span>
                  <span className={styles.statLabel}>Followers</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.actionSection}>
            {!isCurrentUser && (
              <Button
                text={isFollowing ? "Following" : "Follow"}
                onClick={handleFollow}
                className={styles.followBtn}
                aria-label={isFollowing ? `Unfollow ${mockUser.name}` : `Follow ${mockUser.name}`}
              />
            )}
            <button className={styles.shareBtn} title="Share profile" aria-label="Share profile">
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/>
                </g>
              </svg>
            </button>
          </div>
        </header>
        <div className={styles.tabs}>
          <button
            className={tab === "recipes" ? styles.activeTab : ""}
            onClick={() => setTab("recipes")}
          >
            Recipes
          </button>
          <button
            className={tab === "liked" ? styles.activeTab : ""}
            onClick={() => setTab("liked")}
          >
            Liked
          </button>
        </div>
        <div className={styles.recipeGrid}>
          {(tab === "recipes" ? mockUser.recipesList : mockUser.likedList).map((recipe) => (
            <div key={recipe.id} className={styles.recipeCard}>
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={200}
                height={150}
                className={styles.recipeImg}
              />
              <div className={styles.recipeTitle}>{recipe.title}</div>
              <div className={styles.recipeDuration}>Food • {recipe.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 