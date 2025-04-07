import { useEffect, useState } from 'react';
import { Book } from "../types/Book";
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination.tsx';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                const data = await fetchBooks(pageSize, pageNum, selectedCategories);

                setBooks(data.books);
                setTotalItems(data.totalNumBooks);
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [pageSize, pageNum, totalItems, selectedCategories]);

    return (
        <>
            {/* ✅ Bootstrap container for padding and alignment */}
            <div className="container my-4">
                <h1 className="mb-4">All of Our Books</h1>

                {/* ✅ Bootstrap grid system: responsive rows and columns */}
                <div className="row">
                    {books.map((b) => (
                        // ✅ Each card in a responsive column
                        <div className="col-md-6 col-lg-4 mb-4" key={b.bookId}>
                            {/* ✅ Bootstrap card with shadow and full-height layout */}
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{b.title}</h5>

                                    {/* ✅ Consistent list styling using Bootstrap list utilities */}
                                    <ul className="list-unstyled mb-3">
                                        <li><strong>Author:</strong> {b.author}</li>
                                        <li><strong>Publisher:</strong> {b.publisher}</li>
                                        <li><strong>ISBN:</strong> {b.isbn}</li>
                                        <li><strong>Classification:</strong> {b.classification}</li>
                                        <li><strong>Category:</strong> {b.category}</li>
                                        <li><strong>Page Count:</strong> {b.pageCount}</li>
                                        <li><strong>Price:</strong> ${b.price}</li>
                                    </ul>

                                    {/* ✅ Styled button using Bootstrap */}
                                    <button
                                        className="btn btn-success mt-auto"
                                        onClick={() =>
                                            navigate(`/donate/${b.title}/${b.price}/${b.bookId}`)
                                        }
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ Pagination inside the container */}
                <Pagination
                    currentPage={pageNum}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setPageNum}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setPageNum(1);
                    }}
                />
            </div> {/* ✅ FIXED: Closing container div was missing */}
        </>
    );
}

export default BookList;
