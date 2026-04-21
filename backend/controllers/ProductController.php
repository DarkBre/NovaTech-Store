<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/User.php';

class ProductController
{
    public function handle(): void
    {
        try {
            match ($_SERVER['REQUEST_METHOD']) {
                'GET' => $this->index(),
                'POST' => $this->store(),
                'PUT' => $this->update(),
                'DELETE' => $this->destroy(),
                default => send_json(['message' => 'Method không được hỗ trợ.'], 405),
            };
        } catch (Throwable $error) {
            send_json(['message' => $error->getMessage()], 500);
        }
    }

    private function index(): void
    {
        send_json(Product::all());
    }

    private function store(): void
    {
        $this->ensureAdmin();
        send_json(Product::create($this->validatedProduct()), 201);
    }

    private function update(): void
    {
        $this->ensureAdmin();
        $id = $this->productId();
        send_json(Product::update($id, $this->validatedProduct()));
    }

    private function destroy(): void
    {
        $this->ensureAdmin();
        Product::delete($this->productId());
        send_json(['ok' => true]);
    }

    private function ensureAdmin(): void
    {
        $userId = (int) ($_SESSION['user_id'] ?? 0);
        $role = (string) ($_SESSION['role'] ?? '');

        if ($userId <= 0 || $role !== 'admin') {
            send_json(['message' => 'Bạn cần đăng nhập bằng tài khoản admin để thực hiện thao tác này.'], 403);
        }

        $statement = db()->prepare('SELECT id FROM users WHERE id = :id AND role = :role LIMIT 1');
        $statement->execute([
            'id' => $userId,
            'role' => 'admin',
        ]);

        if (!$statement->fetch()) {
            send_json(['message' => 'Phiên đăng nhập không hợp lệ hoặc không có quyền admin.'], 403);
        }
    }

    private function productId(): int
    {
        $id = (int) ($_GET['id'] ?? 0);

        if ($id <= 0) {
            send_json(['message' => 'Thiếu id sản phẩm.'], 400);
        }

        return $id;
    }

    private function validatedProduct(): array
    {
        $data = request_json();
        $required = ['name', 'category', 'price', 'rating', 'description', 'image', 'badge', 'colors', 'features'];

        foreach ($required as $field) {
            if (!array_key_exists($field, $data)) {
                send_json(['message' => "Thiếu trường $field."], 400);
            }
        }

        $colors = is_array($data['colors']) ? $data['colors'] : [];
        $features = is_array($data['features']) ? $data['features'] : [];

        return [
            'name' => trim((string) $data['name']),
            'category' => trim((string) $data['category']),
            'price' => (float) $data['price'],
            'rating' => (float) $data['rating'],
            'description' => trim((string) $data['description']),
            'image' => trim((string) $data['image']),
            'badge' => trim((string) $data['badge']),
            'colors' => json_encode(array_values($colors), JSON_UNESCAPED_UNICODE),
            'features' => json_encode(array_values($features), JSON_UNESCAPED_UNICODE),
        ];
    }
}
