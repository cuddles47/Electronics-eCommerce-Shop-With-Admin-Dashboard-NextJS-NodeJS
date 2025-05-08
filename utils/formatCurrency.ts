/**
 * Format a number to VND currency format
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "93.990.000đ")
 */
export function formatCurrency(amount: number): string {
  // Không cần chia giá trị, hiển thị đầy đủ
  return amount.toLocaleString('vi-VN') + 'đ';
}