// app/api/finik/create-payment/route.js
import { NextResponse } from 'next/server';
import { createFinikPayment } from '@/lib/finik';

/**
 * POST /api/finik/create-payment
 * Создает платеж в Finik с фиксированной ценой 5 сомов
 */
export async function POST(request) {
  try {
    // 1. Получение данных из запроса
    const body = await request.json();
    const { orderId, userId } = body;

    // 2. Валидация данных (orderId опционален)
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    // 3. Создание данных для платежа (цена фиксированная 5 сомов)
    const paymentData = {
      orderId: orderId || 'order-' + Date.now(),
      userId,
    };

    console.log('Creating Finik payment:', paymentData);

    // 4. Создание платежа в Finik
    const paymentUrl = await createFinikPayment(paymentData);

    console.log('✓ Payment URL created:', paymentUrl);

    // 5. Возврат URL платежной страницы
    return NextResponse.json({
      success: true,
      paymentUrl,
      amount: 5, // Фиксированная цена
    });

  } catch (error) {
    console.error('Error creating Finik payment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
