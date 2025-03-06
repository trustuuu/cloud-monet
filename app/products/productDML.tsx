"use server";

import { revalidateTag } from "next/cache";
import db from "../lib/db";
import getSession from "../lib/session";

export async function getProductsWithPage(take: number) {
  //await new Promise((resolve) => setTimeout(resolve, 100000));

  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },
    take: take,
  });
  return products;
}

export async function getMoreProduct(page: number, itemCount: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
    skip: page * 5,
    take: itemCount,
  });
  console.log(
    "product from db",
    products.map((p) => `${p.id} : ${p.title}`)
  );
  return products;
}

export async function getProductLite(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export async function getUser(id: number) {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      avatar: true,
      username: true,
    },
  });
  return user;
}

export async function getProduct(id: number) {
  //await new Promise((resolve) => setTimeout(resolve, 5000));
  const product = await db.product.findUnique({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
      description: true,
      userId: true,
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      posts: {
        select: {
          id: true,
          productId: true,
          title: true,
          description: true,
          views: true,
          created_at: true,
          owner: {
            select: {
              username: true,
              avatar: true,
            },
          },
          comments: {
            select: {
              id: true,
              userId: true,
              payload: true,
              created_at: true,
              postId: true,
              owner: {
                select: {
                  avatar: true,
                  username: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
    // include: {
    //   user: {
    //     select: {
    //       username: true,
    //       avatar: true,
    //     },
    //   },
    // },
  });
  return product;
}

export const delProduct = async (id: number) => {
  await db.product.delete({
    where: {
      id,
    },
  });
};

export async function likePost(productId: number) {
  //await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        productId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${productId}`);
  } catch {}
}

export async function dislikePost(productId: number) {
  //await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          productId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${productId}`);
  } catch {}
}

export async function getMaxCommentId() {
  const commentMax = await db.comment.aggregate({
    _max: {
      id: true,
    },
  });
  return commentMax._max.id;
}

export async function deleteComment(id: number) {
  console.log("delete id", id);
  await db.comment.delete({
    where: { id },
  });
}

export async function addComment(_: any, formData: FormData) {
  //await new Promise((resolve) => setTimeout(resolve, 10000));
  const data = {
    payload: (formData.get("new_payload") ?? "").toString()!,
    userId: Number(formData.get("userId")),
    postId: Number(formData.get("postId")),
  };

  const comment = await db.comment.create({
    data: data,
    select: {
      id: true,
      userId: true,
      payload: true,
      created_at: true,
      postId: true,
      owner: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return comment;
}

export const getRoomsByUser = async (userId: number) => {
  const rooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      users: {
        select: { id: true, username: true, avatar: true },
      },
    },
  });

  return rooms;
};

export const getRoomsByProduct = async (productId: number) => {
  const rooms = await db.chatRoom.findMany({
    where: {
      productId: productId,
    },
    include: {
      users: {
        select: { id: true, username: true, avatar: true },
      },
    },
  });
  return rooms;
};

export const getRoom = async (id: string) => {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const isLegitUser = Boolean(
      room.users.find((user) => user.id === session.id)
    );
    if (!isLegitUser) {
      return null;
    }
  }
  return room;
};

export const delRoom = async (id: string) => {
  await db.chatRoom.delete({
    where: {
      id,
    },
  });
};

export const getMessage = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
};

export interface StreamProps {
  title: string;
  stream_id: string;
  stream_key: string;
  userId: number;
}

export async function createStream(data: StreamProps) {
  const stream = await db.liveStream.create({
    data,
    select: {
      id: true,
    },
  });

  return stream;
}

export async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
}

export async function getPosts() {
  //await new Promise((resolve) => setTimeout(resolve, 10000));
  const posts = await db.post.findMany({
    select: {
      id: true,
      productId: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      owner: {
        select: {
          username: true,
          avatar: true,
        },
      },
      comments: {
        select: {
          payload: true,
          owner: true,
          created_at: true,
          id: true,
          userId: true,
          postId: true,
        },
      },
      userId: true,

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return posts;
}

export async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            userId: true,
            owner: true,
            payload: true,
            created_at: true,
            postId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch {
    return null;
  }
}

export async function getPostByProduct(productId: number) {
  const posts = await db.post.findMany({
    where: {
      productId,
    },
    select: {
      id: true,
      productId: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      owner: {
        select: {
          username: true,
          avatar: true,
        },
      },
      comments: {
        select: {
          payload: true,
          owner: true,
          created_at: true,
          id: true,
          userId: true,
          postId: true,
        },
      },
      userId: true,

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return posts;
}
