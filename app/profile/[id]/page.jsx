"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";
import MessageBox from "@components/MessageBox";
import axios from "axios";

const UserProfile = ({ params }) => {
    const searchParams = useSearchParams();
    const userName = searchParams.get("name");

    const [userPosts, setUserPosts] = useState([]);

    const [userinfo, setUserinfo] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {

            try {
                const response = await axios.get(`/api/users/${params?.id}/posts`);
                setUserPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${params?.id}/info`);
                setUserinfo(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        if (params?.id) {
            fetchPosts();
            fetchUser();
        }

    }, [params.id]);

    return (
        <div >
            <Profile
                name={userName}
                desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
                data={userPosts}
            />

            <MessageBox sendTo={params?.id} sendToName={userName} sendToImage={userinfo.image} />

        </div>
    );
};

export default UserProfile;