import axios from "axios";
import { serverApi } from "../../lib/config";
import { Comment, CommentInput } from "../../lib/types/comment";

class CommentService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getComments(productId: string): Promise<Comment[]> {
    try {
      const url = `${this.path}/comment/all?productId=${productId}`;
      const result = await axios.get(url);
      console.log("getComments:", result);

      return result.data;
    } catch (err) {
      console.log("Error, getComments:", err);
      throw err;
    }
  }

  public async createComment(input: CommentInput): Promise<Comment> {
    try {
      const url = `${this.path}/comment/create`;
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("createComment:", result);

      return result.data;
    } catch (err) {
      console.log("Error, createComment:", err);
      throw err;
    }
  }
}

export default CommentService;
