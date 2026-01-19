import axios from "axios";

export const uploadToImgBB = async (imageBuffer: Buffer): Promise<string> => {
  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        image: imageBuffer.toString("base64"),
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    return response.data.data.url;
  } catch (error) {
    console.error("Erro no upload ImgBB:", error);
    throw new Error("Falha ao fazer upload da imagem.");
  }
};