"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Form from "@components/Form";

const CreatePrompt = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [submitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({ prompt: "", tag: "" });

    const createPrompt = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post("/api/prompt/new", {
                prompt: post.prompt,
                userId: session?.user.id,
                tag: post.tag,
            }, {});

            router.push("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form
            type='Create'
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={createPrompt}
        />
    );
};

export default CreatePrompt;