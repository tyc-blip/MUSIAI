import { Audio } from 'expo-av';

let sound = null;

export const playSound = async (source) => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
  const { sound: newSound, status } = await Audio.Sound.createAsync({ uri: source }, { shouldPlay: true });
  sound = newSound;
  return status;
};

export const stopSound = async () => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
};

export const getSoundInstance = () => sound;
