import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      const { order, page, limit, productCollection, search } = input;
      let url = `${this.path}/product/all?order=${order}&page=${page}&limit=${limit}`;
      if (productCollection) url += `&productCollection=${productCollection}`;
      if (search) url += `&search=${search}`;

      const { data, status } = await axios.get(url); // axios(frontend va backend da ishlaydi) ajax, fetch, require-ip
      console.log("getProducts:", status, data);

      return data;
    } catch (err) {
      console.log("Error, getProducts:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getProduct:", result);

      return result.data;
    } catch (err) {
      console.log("Error, getProducts:", err);
      throw err;
    }
  }
}

export default ProductService;
