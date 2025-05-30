"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/ProfilePage.module.css";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { currentUser } from "@/constants/currentUser";
import { Recipe } from "@/types";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { getAccessToken } from "@/services/auth";

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
      _id: "1",
      title: "Pancake", 
      category: "Food",
      description: "Delicious fluffy pancakes",
      ingredients: ["flour", "eggs", "milk"],
      instructions: [],
      cookingDuration: 30,
      imageUrl: "",
      likes: 0,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    },
    { 
      _id: "2",
      title: "Salad", 
      category: "Food",
      description: "Fresh garden salad",
      ingredients: ["lettuce", "tomatoes", "cucumber"],
      instructions: [],
      cookingDuration: 15,
      imageUrl: "",
      likes: 0,
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02"
    },
    { 
      _id: "3",
      title: "Salad", 
      category: "Food",
      description: "Caesar salad",
      ingredients: ["romaine", "croutons", "parmesan"],
      instructions: [],
      cookingDuration: 20,
      imageUrl: "",
      likes: 0,
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03"
    },
    { 
      _id: "4",
      title: "Pancake", 
      category: "Food",
      description: "Blueberry pancakes",
      ingredients: ["flour", "eggs", "milk", "blueberries"],
      instructions: [],
      cookingDuration: 35,
      imageUrl: "",
      likes: 0,
      createdAt: "2024-01-04",
      updatedAt: "2024-01-04"
    }
  ],
  likedList: [
    { 
      _id: "5",
      title: "Waffles", 
      category: "Food",
      description: "Crispy waffles",
      ingredients: ["flour", "eggs", "milk", "butter"],
      instructions: [],
      cookingDuration: 25,
      imageUrl: "",
      likes: 0,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05"
    }
  ],
};

// Helper to decode JWT
function parseJwt(token: string) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    console.log('JWT payload:', JSON.parse(jsonPayload));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const ProfilePage = () => {
  const { username } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState("recipes");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [pageUsername, setPageUsername] = useState<string>("");
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [likedLoading, setLikedLoading] = useState(false);
  const [likedError, setLikedError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [showShareMsg, setShowShareMsg] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingError, setFollowingError] = useState<string | null>(null);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followersError, setFollowersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken() || "";
        const payload = parseJwt(token);
        const userId = payload?.userId;
        setUserId(userId);
        const response = await axios.get(
          `https://chefio-beta.vercel.app/api/v1/user/get-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setProfile(response.data.profile);
          setIsFollowing(response.data.profile.isFollowing === "following");
          setPageUsername(response.data.profile.username);
          if (response.data.profile._id && username !== response.data.profile._id) {
            router.replace(`/profile/${response.data.profile._id}`);
          }
        } else {
          setError(response.data.message || "Failed to fetch profile");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // Fetch liked recipes when tab is switched to 'liked' and not already loaded
  useEffect(() => {
    const fetchLikedRecipes = async () => {
      if (tab !== "liked" || likedRecipes.length > 0 || !userId) return;
      setLikedLoading(true);
      setLikedError(null);
      try {
        const token = getAccessToken() || "";
        const response = await axios.get(
            `https://chefio-beta.vercel.app/api/v1/user/get-liked-recipes-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setLikedRecipes(response.data.recipes.data);
        } else {
          setLikedError(response.data.message || "Failed to fetch liked recipes");
        }
      } catch (err: any) {
        setLikedError(err.response?.data?.message || err.message || "Failed to fetch liked recipes");
      } finally {
        setLikedLoading(false);
      }
    };
    fetchLikedRecipes();
  }, [tab, userId, likedRecipes.length]);

  // Fetch following list when tab is switched to 'following' and not already loaded
  useEffect(() => {
    const fetchFollowingList = async () => {
      if (tab !== "following" || followingList.length > 0 || !profile?._id) return;
      setFollowingLoading(true);
      setFollowingError(null);
      try {
        const token = getAccessToken() || "";
        const response = await axios.get(
          `https://chefio-beta.vercel.app/api/v1/chef/follow/get-following/${profile._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setFollowingList(response.data.following);
        } else {
          setFollowingError(response.data.message || "Failed to fetch following list");
        }
      } catch (err: any) {
        setFollowingError(err.response?.data?.message || err.message || "Failed to fetch following list");
      } finally {
        setFollowingLoading(false);
      }
    };
    fetchFollowingList();
  }, [tab, profile?._id, followingList.length]);

  // Fetch followers list when tab is switched to 'followers' and not already loaded
  useEffect(() => {
    const fetchFollowersList = async () => {
      if (tab !== "followers" || followersList.length > 0 || !profile?._id) return;
      setFollowersLoading(true);
      setFollowersError(null);
      try {
        const token = getAccessToken() || "";
        const response = await axios.get(
          `https://chefio-beta.vercel.app/api/v1/chef/follow/get-followers/${profile._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setFollowersList(response.data.followers);
        } else {
          setFollowersError(response.data.message || "Failed to fetch followers list");
        }
      } catch (err: any) {
        setFollowersError(err.response?.data?.message || err.message || "Failed to fetch followers list");
      } finally {
        setFollowersLoading(false);
      }
    };
    fetchFollowersList();
  }, [tab, profile?._id, followersList.length]);

  const isCurrentUser = userId === (profile?._id || "");
  const handleFollow = () => setIsFollowing((prev) => !prev);

  // Share profile link handler
  const handleShare = () => {
    const url = `${window.location.origin}/profile/${profile?._id}`;
    setShareUrl(url);
    setShowShareMsg(true);
  };
  const handleCopyShareUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const handleCloseShare = () => {
    setShowShareMsg(false);
    setShareUrl("");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.profileContainer}><div>Loading...</div></div>
      </>
    );
  }
  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className={styles.profileContainer}><div>{error || "Profile not found"}</div></div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Chefio | Profile</title>
        <meta name="description" content={`View the profile and recipes of ${profile?.username || pageUsername} on Chefio.`} />
      </Head>
      <Navbar />
      <div className={styles.profileContainer}>
        <header className={styles.header}>
          <div className={styles.avatarSection}>
            <Image
              src={profile.profilePicture}
              alt={profile?.username || pageUsername}
              width={100}
              height={100}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              {isCurrentUser && (
                <div className={styles.yourProfileLabel}>Your Profile:</div>
              )}
              <h2 className={styles.name}>{profile?.username || pageUsername}</h2>
              <div className={styles.stats}>
                <div>
                  <span className={styles.statNumber}>{profile.recipes?.totalRecipes ?? 0}</span>
                  <span className={styles.statLabel}>Recipes</span>
                </div>
                <div>
                  <span className={styles.statNumber}>{profile.followingCount}</span>
                  <span className={styles.statLabel}>Following</span>
                </div>
                <div>
                  <span className={styles.statNumber}>{profile.followersCount}</span>
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
                aria-label={isFollowing ? `Unfollow ${profile?.username || pageUsername}` : `Follow ${profile?.username || pageUsername}`}
              />
            )}
            <button className={styles.shareBtn} title="Share profile" aria-label="Share profile" onClick={handleShare}>
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
          <button
            className={tab === "following" ? styles.activeTab : ""}
            onClick={() => setTab("following")}
          >
            Following
          </button>
          <button
            className={tab === "followers" ? styles.activeTab : ""}
            onClick={() => setTab("followers")}
          >
            Followers
          </button>
        </div>
        <div className={styles.recipeGrid}>
          {tab === "recipes" && (profile.recipes?.data ?? []).map((recipe: any) => (
            <Link key={recipe._id} href={`/recipes/${recipe._id}`} className={styles.recipeCard} aria-label={`View details for ${recipe.foodName}`}>
              <Image
                src={recipe.recipePicture}
                alt={recipe.foodName}
                width={200}
                height={150}
                className={styles.recipeImg}
              />
              <div className={styles.recipeTitle}>{recipe.foodName}</div>
              <div className={styles.recipeDuration}>{recipe.category?.name} • {recipe.cookingDuration} mins</div>
            </Link>
          ))}
          {tab === "liked" && (
            likedLoading ? (
              <div>Loading liked recipes...</div>
            ) : likedError ? (
              <div>{likedError}</div>
            ) : likedRecipes.length === 0 ? (
              <div>No liked recipes found.</div>
            ) : (
              likedRecipes.map((recipe: any) => (
                <Link key={recipe._id} href={`/recipes/${recipe._id}`} className={styles.recipeCard} aria-label={`View details for ${recipe.foodName}`}>
                  <Image
                    src={recipe.recipePicture}
                    alt={recipe.foodName}
                    width={200}
                    height={150}
                    className={styles.recipeImg}
                  />
                  <div className={styles.recipeTitle}>{recipe.foodName}</div>
                  <div className={styles.recipeDuration}>{recipe.category?.name} • {recipe.cookingDuration} mins</div>
                </Link>
              ))
            )
          )}
          {tab === "following" && (
            followingLoading ? (
              <div>Loading following...</div>
            ) : followingError ? (
              <div>{followingError}</div>
            ) : followingList.length === 0 ? (
              <div>No following found.</div>
            ) : (
              followingList.map((user: any) => (
                <div key={user._id} className={styles.recipeCard} style={{alignItems:'center',justifyContent:'center',padding:'1rem'}}>
                  <Image
                    src={user.profilePicture || "/profile-avatar.jpg"}
                    alt={user.username || user._id}
                    width={80}
                    height={80}
                    className={styles.avatar}
                  />
                  <div className={styles.recipeTitle}>{user.username || user._id}</div>
                </div>
              ))
            )
          )}
          {tab === "followers" && (
            followersLoading ? (
              <div>Loading followers...</div>
            ) : followersError ? (
              <div>{followersError}</div>
            ) : followersList.length === 0 ? (
              <div>No followers found.</div>
            ) : (
              followersList.map((user: any) => (
                <div key={user._id} className={styles.recipeCard} style={{alignItems:'center',justifyContent:'center',padding:'1rem'}}>
                  <Image
                    src={user.profilePicture || "/profile-avatar.jpg"}
                    alt={user.username || user._id}
                    width={80}
                    height={80}
                    className={styles.avatar}
                  />
                  <div className={styles.recipeTitle}>{user.username || user._id}</div>
                </div>
              ))
            )
          )}
        </div>
      </div>
      {showShareMsg && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 10,
            padding: '2rem',
            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative'
          }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Share your profile link</div>
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{ width: '100%', padding: '0.5rem', fontSize: 16, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
              onFocus={e => e.target.select()}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopyShareUrl} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}>Copy</button>
              <button onClick={handleCloseShare} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, background: '#eee', color: '#222', border: 'none', fontWeight: 500, cursor: 'pointer' }}>Close</button>
            </div>
            {copied && (
              <div style={{ color: '#0070f3', fontWeight: 500, marginTop: 8 }}>
                Copied!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage; 