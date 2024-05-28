import { Box, Container, VStack, HStack, Text, Input, Button, Flex, Heading, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";
import { usePosts, useAddPost } from "../integrations/supabase";

const Index = () => {
  const { data: posts, isLoading, isError, error } = usePosts();
  const addPostMutation = useAddPost();
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      addPostMutation.mutate({ title: newPost, body: newPost });
      setNewPost("");
    }
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <Box as="nav" bg="blue.500" color="white" p={4}>
        <Container maxW="container.lg">
          <Heading size="md">Public Post Board</Heading>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.lg" py={6}>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {posts.length === 0 ? (
              <Text>No posts yet. Be the first to post!</Text>
            ) : (
              posts.map((post) => (
                <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                  <Text>{post.title}</Text>
                </Box>
              ))
            )}
          </VStack>
        )}
      </Container>

      {/* Post Submission Form */}
      <Box bg="gray.100" p={4} position="fixed" bottom={0} width="100%">
        <Container maxW="container.lg">
          <Flex as="form" onSubmit={handlePostSubmit} align="center">
            <Input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your post here..."
              mr={2}
            />
            <Button type="submit" colorScheme="blue" isLoading={addPostMutation.isLoading}>Post</Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;