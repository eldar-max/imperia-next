// app/api/finik/webhook/route.js
import { NextResponse } from 'next/server';
import { 
  verifyFinikWebhook, 
  isTimestampValid 
} from '@/lib/finik';

/**
 * POST /api/finik/webhook
 * Обрабатывает webhook от Finik после завершения платежа
 */
export async function POST(request) {
  try {
    // 1. Получение заголовков
    const signature = request.headers.get('signature');
    const timestamp = request.headers.get('x-api-timestamp');
    const host = request.headers.get('host');

    if (!signature || !timestamp) {
      console.error('Missing signature or timestamp in webhook');
      return NextResponse.json(
        { error: 'Missing signature or timestamp' },
        { status: 400 }
      );
    }

    // 2. Проверка актуальности timestamp (защита от replay-атак)
    if (!isTimestampValid(timestamp)) {
      console.error('Webhook timestamp is too old or invalid');
      return NextResponse.json(
        { error: 'Invalid timestamp' },
        { status: 400 }
      );
    }

    // 3. Получение тела запроса
    const body = await request.json();

    console.log('📩 Webhook received:', {
      status: body.status,
      transactionId: body.transactionId,
      amount: body.amount,
    });

    // 4. Подготовка заголовков для верификации
    const headers = {
      'host': host || '',
    };

    // 5. Верификация подписи
    const webhookPath = '/api/finik/webhook';
    const isValid = await verifyFinikWebhook(
      signature, 
      timestamp, 
      body, 
      headers, 
      webhookPath
    );
    
    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      
      // В продакшене всегда отклоняем невалидные подписи
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      
      console.warn('⚠️  Continuing despite invalid signature (development mode)');
    } else {
      console.log('✓ Webhook signature verified');
    }

    // 6. Извлечение метаданных
    let metadata = {};
    
    try {
      if (body.data && body.data.metadata) {
        if (typeof body.data.metadata === 'string') {
          metadata = JSON.parse(body.data.metadata);
        } else {
          metadata = body.data.metadata;
        }
      }
    } catch (error) {
      console.error('Error parsing metadata:', error);
    }

    // 7. Обработка успешного платежа
    if (body.status === 'SUCCEEDED' || body.status === 'succeeded') {
      const { userId, orderId, paymentId } = metadata;

      console.log(`✅ [PAYMENT_SUCCESS] Order ID: ${orderId} | Amount: ${body.amount} сом | Transaction: ${body.transactionId}`);
      
      // ЗДЕСЬ ВАША ЛОГИКА ОБРАБОТКИ УСПЕШНОГО ПЛАТЕЖА
      // Например:
      // - Обновление статуса заказа в БД
      // - Отправка email уведомления
      // - Активация подписки
      // - Начисление баланса и т.д.
      
      // Пример (адаптируйте под вашу БД):
      /*
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          transactionId: body.transactionId,
          paidAt: new Date(body.transactionDate),
          amount: body.amount,
        },
      });
      */
      
      console.log(`📧 TODO: Send confirmation email to user ${userId}`);
      console.log(`📦 TODO: Update order ${orderId} status to PAID`);
    } 
    // 8. Обработка неудачного платежа
    else if (body.status === 'FAILED' || body.status === 'failed') {
      const { userId, orderId } = metadata;
      console.error(`❌ [PAYMENT_FAILED] Order ID: ${orderId} | Transaction: ${body.transactionId}`);
      
      // ЗДЕСЬ ВАША ЛОГИКА ОБРАБОТКИ НЕУДАЧНОГО ПЛАТЕЖА
      // Например:
      // - Обновление статуса заказа
      // - Отправка уведомления пользователю
      
      console.log(`📧 TODO: Send payment failed notification to user ${userId}`);
    }

    // 9. Возврат успешного ответа
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing Finik webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
