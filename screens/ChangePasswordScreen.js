import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseClient'; // Adjust the import based on where your Supabase client is configured

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [oldPasswordVisible, setOldPasswordVisible] = React.useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);

  const handleChangePassword = async () => {
    // Validation checks
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (!storedEmail) {
        Alert.alert('Error', 'No user email found.');
        return;
      }

      // Fetch the user from Supabase using email
      const { data: user, error: fetchError } = await supabase.auth.admin.listUsers({ email: storedEmail });
      if (fetchError || !user || user.length === 0) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        id: user[0].id,
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      Alert.alert('Success', 'Password updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to change password: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#6E45E2" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.changePasswordButton}>
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Enter your old password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!oldPasswordVisible}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
            <Ionicons name={oldPasswordVisible ? "eye-off" : "eye"} size={24} color="#6E45E2" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Enter your new password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!newPasswordVisible}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
            <Ionicons name={newPasswordVisible ? "eye-off" : "eye"} size={24} color="#6E45E2" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm your password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={24} color="#6E45E2" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleChangePassword}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  changePasswordButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  changePasswordButtonText: {
    color: '#6E45E2',
    fontSize: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 16,
  },
  verifyButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChangePasswordScreen;
