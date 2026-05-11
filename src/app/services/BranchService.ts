import axios from "axios";
import { serverApi } from "../../lib/config";
import { Branch } from "../../lib/types/branch";

class BranchService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getAllBranches(): Promise<Branch[]> {
    try {
      const url = `${this.path}/branch/all`;
      const result = await axios.get(url);
      console.log("getAllBranches:", result);

      return result.data;
    } catch (err) {
      console.log("Error, getAllBranches:", err);
      throw err;
    }
  }
}

export default BranchService;
