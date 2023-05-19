import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import GroupChatModel from './miscellaneous/GroupChatModel';

const MyChats = ({ fetchAgain }) => { // Destructure `fetchAgain` from props

  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);


  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="rgba(110, 231, 183, 0.5)"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily=""
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
        </Box>
        <GroupChatModel>
        </GroupChatModel>
      </div>
      {/* <Button
            // d="flex"
            // marginRight={'10px'}
            // bg={'#38B2AC'}
            // fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            // rightIcon={<AddIcon />}
            // ml="left" // Added this line to align the button to the right
          >
            New Group
          </Button> */}



      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        maxH="auto" // Adjust the maximum height as per your requirements
        overflow="auto"
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ?
                    getSender(loggedUser, chat.users)
                    : (chat.chatName)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>

  )
}

export default MyChats
