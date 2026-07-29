import ReactNativeBiometrics from 'react-native-biometrics';

class BiometricsService {
  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
    this.isAvailable = false;
    this.biometryType = null;
  }

  // Check if biometrics is available
  async isAvailable() {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
      
      this.isAvailable = available;
      this.biometryType = biometryType;
      
      return available;
    } catch (error) {
      console.error('Check biometrics availability error:', error);
      this.isAvailable = false;
      return false;
    }
  }

  // Get biometric type
  getBiometryType() {
    return this.biometryType;
  }

  // Get biometric type name
  getBiometryTypeName() {
    switch (this.biometryType) {
      case 'TouchID':
        return 'Touch ID';
      case 'FaceID':
        return 'Face ID';
      case 'Biometrics':
        return 'Biometria';
      case 'Fingerprint':
        return 'Impressão Digital';
      default:
        return 'Biometria';
    }
  }

  // Check if biometrics is enrolled
  async isEnrolled() {
    try {
      const { available } = await this.rnBiometrics.isSensorAvailable();
      return available;
    } catch (error) {
      console.error('Check biometrics enrollment error:', error);
      return false;
    }
  }

  // Create biometric key
  async createKey() {
    try {
      const { publicKey } = await this.rnBiometrics.createKeys();
      return publicKey;
    } catch (error) {
      console.error('Create biometric key error:', error);
      throw error;
    }
  }

  // Delete biometric key
  async deleteKey() {
    try {
      await this.rnBiometrics.deleteKeys();
      return true;
    } catch (error) {
      console.error('Delete biometric key error:', error);
      throw error;
    }
  }

  // Check if key exists
  async keyExists() {
    try {
      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      return keysExist;
    } catch (error) {
      console.error('Check key exists error:', error);
      return false;
    }
  }

  // Simple biometric authentication
  async authenticate() {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage: 'Autentique-se para continuar',
        cancelButtonText: 'Cancelar',
      });

      return success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  // Biometric authentication with custom message
  async authenticateWithMessage(message = 'Autentique-se para continuar') {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage: message,
        cancelButtonText: 'Cancelar',
      });

      return success;
    } catch (error) {
      console.error('Biometric authentication with message error:', error);
      return false;
    }
  }

  // Biometric authentication for PIX
  async authenticateForPIX(amount) {
    const message = `Confirme o PIX de ${amount} com sua biometria`;
    return this.authenticateWithMessage(message);
  }

  // Biometric authentication for transfer
  async authenticateForTransfer(amount, recipient) {
    const message = `Confirme a transferência de ${amount} para ${recipient} com sua biometria`;
    return this.authenticateWithMessage(message);
  }

  // Biometric authentication for payment
  async authenticateForPayment(amount, merchant) {
    const message = `Confirme o pagamento de ${amount} para ${merchant} com sua biometria`;
    return this.authenticateWithMessage(message);
  }

  // Create signature with biometrics
  async createSignature(payload) {
    try {
      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage: 'Confirme com sua biometria',
        payload: payload,
        cancelButtonText: 'Cancelar',
      });

      if (success) {
        return signature;
      }
      
      throw new Error('Falha na autenticação biométrica');
    } catch (error) {
      console.error('Create signature error:', error);
      throw error;
    }
  }

  // Verify signature
  async verifySignature(signature, payload) {
    try {
      const { success } = await this.rnBiometrics.biometricKeysExist();
      
      if (!success) {
        throw new Error('Chaves biométricas não encontradas');
      }

      // In a real app, you would verify the signature with your backend
      return true;
    } catch (error) {
      console.error('Verify signature error:', error);
      return false;
    }
  }

  // Setup biometrics for user
  async setupBiometrics(userId) {
    try {
      // Check if biometrics is available
      const available = await this.isAvailable();
      if (!available) {
        throw new Error('Biometria não disponível neste dispositivo');
      }

      // Check if already enrolled
      const enrolled = await this.isEnrolled();
      if (!enrolled) {
        throw new Error('Biometria não configurada no dispositivo');
      }

      // Create keys
      const publicKey = await this.createKey();
      
      // Store biometric settings
      const biometricData = {
        userId,
        publicKey,
        biometryType: this.biometryType,
        enabled: true,
        setupDate: new Date().toISOString(),
      };

      // In a real app, you would store this on your backend
      console.log('Biometric setup completed:', biometricData);
      
      return biometricData;
    } catch (error) {
      console.error('Setup biometrics error:', error);
      throw error;
    }
  }

  // Disable biometrics for user
  async disableBiometrics(userId) {
    try {
      // Delete keys
      await this.deleteKey();
      
      // Update biometric settings
      const biometricData = {
        userId,
        enabled: false,
        disabledDate: new Date().toISOString(),
      };

      // In a real app, you would update this on your backend
      console.log('Biometric disabled:', biometricData);
      
      return true;
    } catch (error) {
      console.error('Disable biometrics error:', error);
      throw error;
    }
  }

  // Get biometric status
  async getBiometricStatus() {
    try {
      const available = await this.isAvailable();
      const enrolled = await this.isEnrolled();
      const keyExists = await this.keyExists();

      return {
        available,
        enrolled,
        keyExists,
        biometryType: this.biometryType,
        biometryTypeName: this.getBiometryTypeName(),
      };
    } catch (error) {
      console.error('Get biometric status error:', error);
      return {
        available: false,
        enrolled: false,
        keyExists: false,
        biometryType: null,
        biometryTypeName: 'Biometria',
      };
    }
  }

  // Check if biometrics is enabled for user
  async isBiometricsEnabled(userId) {
    try {
      // In a real app, you would check this from your backend
      // For now, we'll check if keys exist locally
      const keyExists = await this.keyExists();
      return keyExists;
    } catch (error) {
      console.error('Check biometrics enabled error:', error);
      return false;
    }
  }

  // Handle biometric error
  handleBiometricError(error) {
    console.error('Biometric error:', error);
    
    // Map common biometric errors to user-friendly messages
    if (error.message.includes('UserCancel')) {
      return 'Autenticação cancelada pelo usuário';
    } else if (error.message.includes('SystemCancel')) {
      return 'Autenticação cancelada pelo sistema';
    } else if (error.message.includes('AuthenticationFailed')) {
      return 'Falha na autenticação biométrica';
    } else if (error.message.includes('UserFallback')) {
      return 'Usuário escolheu método alternativo';
    } else if (error.message.includes('NotAvailable')) {
      return 'Biometria não disponível';
    } else if (error.message.includes('NotEnrolled')) {
      return 'Biometria não configurada no dispositivo';
    } else {
      return 'Erro na autenticação biométrica';
    }
  }
}

export const biometricsService = new BiometricsService();
