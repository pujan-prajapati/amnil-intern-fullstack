import { useEffect, useState } from "react";
import { HomeWrapper } from "../../../components/home/HomeWrapper";
import { httpGet } from "../../../services/axios.service";
import { Button, Dropdown, Input, MenuProps, Pagination, Spin } from "antd";
import { FaSearch } from "react-icons/fa";

interface ProductProps {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  likes: number;
  views: number;
  reviews: number;
}

export const ProductsPage = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<{ category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("DESC");
  const [category, setCategory] = useState<string>("");

  const fetchCategoris = async () => {
    setLoading(true);
    try {
      const response = await httpGet("/product/category");
      setCategories(response.data);
    } catch (error) {
      console.log("Failed to fetch categories : ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (
    page: number,
    search: string,
    sortBy: string,
    sortOrder: string,
    category: string
  ) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: 7,
        search,
        sortBy,
        sortOrder,
        category,
      };

      const response = await httpGet("/product", params);
      const { products: productList, totalProducts } = response.data;

      setProducts(productList);
      setTotalProducts(totalProducts);
    } catch (error) {
      console.log("Failed to fetch products : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm, sortBy, sortOrder, category);
    fetchCategoris();
  }, [currentPage, searchTerm, sortBy, sortOrder, category]);

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchProducts(1, search, sortBy, sortOrder, category);
  };

  const handleSortChange = ({ key }: { key: string }) => {
    const [sortByValue, sortOrderValue] = key.split("_");
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1);
  };

  const handleFilterChange = ({ key }: { key: string }) => {
    const [filterByValue, filterOrderValue] = key.split("_");
    setSortBy(filterByValue);
    setSortOrder(filterOrderValue);
    setCurrentPage(1);
  };

  const handleCategoryChange = ({ key }: { key: string }) => {
    setCategory(key);
    setCurrentPage(1);
    fetchProducts(1, searchTerm, sortBy, sortOrder, key);
  };

  const categoryItems: MenuProps["items"] = [
    {
      label: (
        <p className={category === "" ? "custom-selected-item" : ""}>
          All Categories
        </p>
      ),
      key: "",
    },
    ...categories.map((cat) => ({
      label: (
        <p className={category === cat.category ? "custom-selected-item" : ""}>
          {cat.category}
        </p>
      ),
      key: cat.category,
    })),
  ];

  const sortItems: MenuProps["items"] = [
    {
      label: (
        <p
          className={
            sortBy === "price" && sortOrder === "ASC"
              ? "custom-selected-item"
              : ""
          }
        >
          Price Low to High
        </p>
      ),
      key: "price_ASC",
    },
    {
      label: (
        <p
          className={
            sortBy === "price" && sortOrder === "DESC"
              ? "custom-selected-item"
              : ""
          }
        >
          Price High to Low
        </p>
      ),
      key: "price_DESC",
    },
    {
      label: (
        <p
          className={
            sortBy === "createdAt" && sortOrder === "DESC"
              ? "custom-selected-item"
              : ""
          }
        >
          Latest First
        </p>
      ),
      key: "createdAt_DESC",
    },
    {
      label: (
        <p
          className={
            sortBy === "createdAt" && sortOrder === "ASC"
              ? "custom-selected-item"
              : ""
          }
        >
          Oldest First
        </p>
      ),
      key: "createdAt_ASC",
    },
  ];

  const filterItems: MenuProps["items"] = [
    {
      label: (
        <p
          className={
            sortBy === "likes" && sortOrder === "DESC"
              ? "custom-selected-item"
              : ""
          }
        >
          Most Popular
        </p>
      ),
      key: "likes_DESC",
    },
    {
      label: (
        <p
          className={
            sortBy === "views" && sortOrder === "DESC"
              ? "custom-selected-item"
              : ""
          }
        >
          Most Views
        </p>
      ),
      key: "views_DESC",
    },
    {
      label: (
        <p
          className={
            sortBy === "reviews" && sortOrder === "DESC"
              ? "custom-selected-item"
              : ""
          }
        >
          Most Reviews
        </p>
      ),
      key: "reviews_DESC",
    },
  ];

  return (
    <>
      <HomeWrapper>
        <section className="flex justify-between items-center">
          <div className="flex items-center">
            <Input
              className="w-96 rounded-r-none"
              placeholder="Search products"
              size="large"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button
              size="large"
              type="primary"
              className="rounded-l-none"
              onClick={handleSearch}
            >
              <FaSearch />
            </Button>
          </div>

          <div className="flex gap-5">
            <Dropdown
              menu={{
                items: categoryItems,
                onClick: handleCategoryChange,
              }}
              className="cursor-pointer"
              trigger={["click"]}
            >
              <Button>Category</Button>
            </Dropdown>

            <Dropdown
              menu={{ items: sortItems, onClick: handleSortChange }}
              className="cursor-pointer"
              trigger={["click"]}
            >
              <Button>Sort By</Button>
            </Dropdown>

            <Dropdown
              menu={{ items: filterItems, onClick: handleFilterChange }}
              className="cursor-pointer"
              trigger={["click"]}
            >
              <Button>Filter</Button>
            </Dropdown>
          </div>
        </section>

        <section className="my-10 grid grid-cols-4 gap-4 ">
          {loading ? (
            <Spin />
          ) : (
            products.map((item: ProductProps) => (
              <div key={item.id} className="bg-gray-50 p-2 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-contain"
                />

                <div className="space-y-1 p-2">
                  <h2 className="text-xl font-semibold">
                    {item.name.length > 40
                      ? item.name.slice(0, 40) + "..."
                      : item.name}
                  </h2>
                  <p className="text-red-600 font-semibold">Rs. {item.price}</p>
                  <p>
                    <span className="font-semibold">Quantity : </span>{" "}
                    {item.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Lieks : </span>
                    {item.likes}
                  </p>
                  <p>
                    <span className="font-semibold">Views : </span>
                    {item.views}
                  </p>
                  <p>
                    <span className="font-semibold">Reviews : </span>
                    {item.reviews}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
        <Pagination
          className="mt-10"
          total={totalProducts}
          current={currentPage}
          pageSize={5}
          onChange={handlePaginationChange}
        />
      </HomeWrapper>
    </>
  );
};
