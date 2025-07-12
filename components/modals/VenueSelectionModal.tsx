import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export interface VenueSelectionModalProps {
  visible?: boolean;
  onSelect?: (venueId: string) => void;
  onClose?: () => void;
}

const VenueSelectionModal: React.FC<VenueSelectionModalProps> = ({ visible = false, onSelect, onClose }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>        
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>          
          <Text style={[styles.title, { color: theme.colors.text }]}>Select Destination</Text>
          {/* TODO: render venue list */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.colors.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 16,
  },
});

export default VenueSelectionModal;
