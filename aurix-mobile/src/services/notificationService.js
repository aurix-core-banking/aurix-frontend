import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.notificationChannel = 'aurix-banking';
  }

  // Initialize notification service
  async initialize() {
    try {
      if (this.isInitialized) {
        return;
      }

      // Request permissions
      await this.requestPermissions();

      // Configure push notifications
      this.configurePushNotifications();

      this.isInitialized = true;
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Initialize notification service error:', error);
      throw error;
    }
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notificações AUREUS',
            message: 'AUREUS precisa de permissão para enviar notificações importantes sobre sua conta',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Permissão de notificação negada');
        }
      }

      return true;
    } catch (error) {
      console.error('Request permissions error:', error);
      throw error;
    }
  }

  // Configure push notifications
  configurePushNotifications() {
    PushNotification.configure({
      // Called when token is generated
      onRegister: (token) => {
        console.log('FCM Token:', token);
        // In a real app, you would send this token to your backend
        this.storeToken(token.token);
      },

      // Called when a remote or local notification is opened or received
      onNotification: (notification) => {
        console.log('Notification received:', notification);
        
        // Handle different notification types
        this.handleNotification(notification);
      },

      // Called when the user fails to register for remote notifications
      onRegistrationError: (err) => {
        console.error('Registration error:', err);
      },

      // IOS only: Called when the user taps on a notification
      onNotificationOpened: (notification) => {
        console.log('Notification opened:', notification);
        this.handleNotificationOpened(notification);
      },

      // Android only: Called when the user taps on a notification
      onAction: (notification) => {
        console.log('Notification action:', notification);
        this.handleNotificationAction(notification);
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      // Request permissions on init
      requestPermissions: true,
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: this.notificationChannel,
          channelName: 'AUREUS Banking',
          channelDescription: 'Notificações do AUREUS Banking',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  }

  // Handle incoming notification
  handleNotification(notification) {
    const { userInteraction, data, message } = notification;

    // If user tapped the notification
    if (userInteraction) {
      this.handleNotificationTapped(notification);
    }

    // Handle different notification types based on data
    if (data) {
      switch (data.type) {
        case 'pix_received':
          this.handlePIXReceived(data);
          break;
        case 'pix_sent':
          this.handlePIXSent(data);
          break;
        case 'transfer_received':
          this.handleTransferReceived(data);
          break;
        case 'transfer_sent':
          this.handleTransferSent(data);
          break;
        case 'payment_confirmed':
          this.handlePaymentConfirmed(data);
          break;
        case 'security_alert':
          this.handleSecurityAlert(data);
          break;
        case 'investment_update':
          this.handleInvestmentUpdate(data);
          break;
        case 'card_transaction':
          this.handleCardTransaction(data);
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    }
  }

  // Handle notification tapped
  handleNotificationTapped(notification) {
    const { data } = notification;

    if (data && data.screen) {
      // Navigate to specific screen
      this.navigateToScreen(data.screen, data.params);
    }
  }

  // Handle notification opened
  handleNotificationOpened(notification) {
    console.log('Notification opened:', notification);
    this.handleNotificationTapped(notification);
  }

  // Handle notification action
  handleNotificationAction(notification) {
    console.log('Notification action:', notification);
    this.handleNotificationTapped(notification);
  }

  // Navigate to screen (this would be implemented with your navigation)
  navigateToScreen(screen, params = {}) {
    console.log(`Navigate to ${screen} with params:`, params);
    // In a real app, you would use your navigation service here
  }

  // Handle PIX received notification
  handlePIXReceived(data) {
    console.log('PIX received:', data);
    // Show success message or update UI
  }

  // Handle PIX sent notification
  handlePIXSent(data) {
    console.log('PIX sent:', data);
    // Show confirmation message
  }

  // Handle transfer received notification
  handleTransferReceived(data) {
    console.log('Transfer received:', data);
    // Update balance or show notification
  }

  // Handle transfer sent notification
  handleTransferSent(data) {
    console.log('Transfer sent:', data);
    // Show confirmation
  }

  // Handle payment confirmed notification
  handlePaymentConfirmed(data) {
    console.log('Payment confirmed:', data);
    // Update payment status
  }

  // Handle security alert notification
  handleSecurityAlert(data) {
    console.log('Security alert:', data);
    // Show security warning
    Alert.alert(
      'Alerta de Segurança',
      data.message || 'Atividade suspeita detectada em sua conta',
      [
        { text: 'Ver Detalhes', onPress: () => this.navigateToScreen('Security') },
        { text: 'OK', style: 'default' }
      ]
    );
  }

  // Handle investment update notification
  handleInvestmentUpdate(data) {
    console.log('Investment update:', data);
    // Update investment values
  }

  // Handle card transaction notification
  handleCardTransaction(data) {
    console.log('Card transaction:', data);
    // Update card information
  }

  // Store FCM token
  storeToken(token) {
    // In a real app, you would store this token and send it to your backend
    console.log('Storing FCM token:', token);
  }

  // Send local notification
  sendLocalNotification(title, message, data = {}) {
    PushNotification.localNotification({
      channelId: this.notificationChannel,
      title: title,
      message: message,
      data: data,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
    });
  }

  // Send PIX received notification
  sendPIXReceivedNotification(amount, sender) {
    this.sendLocalNotification(
      'PIX Recebido!',
      `Você recebeu ${amount} de ${sender}`,
      {
        type: 'pix_received',
        screen: 'Dashboard',
        amount: amount,
        sender: sender,
      }
    );
  }

  // Send PIX sent notification
  sendPIXSentNotification(amount, recipient) {
    this.sendLocalNotification(
      'PIX Enviado',
      `PIX de ${amount} enviado para ${recipient}`,
      {
        type: 'pix_sent',
        screen: 'PIX',
        amount: amount,
        recipient: recipient,
      }
    );
  }

  // Send security alert notification
  sendSecurityAlertNotification(message) {
    this.sendLocalNotification(
      'Alerta de Segurança',
      message,
      {
        type: 'security_alert',
        screen: 'Security',
        priority: 'high',
      }
    );
  }

  // Send investment update notification
  sendInvestmentUpdateNotification(investment, gain) {
    this.sendLocalNotification(
      'Atualização de Investimento',
      `${investment} rendeu ${gain} hoje`,
      {
        type: 'investment_update',
        screen: 'Investments',
        investment: investment,
        gain: gain,
      }
    );
  }

  // Send card transaction notification
  sendCardTransactionNotification(amount, merchant) {
    this.sendLocalNotification(
      'Transação no Cartão',
      `Compra de ${amount} em ${merchant}`,
      {
        type: 'card_transaction',
        screen: 'Cards',
        amount: amount,
        merchant: merchant,
      }
    );
  }

  // Schedule notification
  scheduleNotification(title, message, date, data = {}) {
    PushNotification.localNotificationSchedule({
      channelId: this.notificationChannel,
      title: title,
      message: message,
      date: date,
      data: data,
      playSound: true,
      soundName: 'default',
    });
  }

  // Cancel all notifications
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Cancel specific notification
  cancelNotification(id) {
    PushNotification.cancelLocalNotifications({ id: id });
  }

  // Get delivered notifications
  getDeliveredNotifications() {
    return new Promise((resolve) => {
      PushNotification.getDeliveredNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  // Clear delivered notifications
  clearDeliveredNotifications() {
    PushNotification.removeAllDeliveredNotifications();
  }

  // Check notification permissions
  async checkPermissions() {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Request notification permissions
  async requestNotificationPermissions() {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Get initial notification
  getInitialNotification() {
    return new Promise((resolve) => {
      PushNotification.getInitialNotification((notification) => {
        resolve(notification);
      });
    });
  }

  // Set application badge count (iOS)
  setApplicationIconBadgeNumber(number) {
    PushNotification.setApplicationIconBadgeNumber(number);
  }

  // Get application badge count (iOS)
  getApplicationIconBadgeNumber() {
    return new Promise((resolve) => {
      PushNotification.getApplicationIconBadgeNumber((badgeCount) => {
        resolve(badgeCount);
      });
    });
  }
}

export const notificationService = new NotificationService();
