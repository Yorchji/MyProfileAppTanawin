import { Platform, StyleSheet } from 'react-native';

import { colors } from './colors';

const cardShadow = Platform.select({
  ios: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
  default: {
    boxShadow: `0px 4px 12px rgba(15, 23, 42, 0.08)`,
  },
});

const floatShadow = Platform.select({
  ios: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  android: { elevation: 6 },
  default: {
    boxShadow: `0px 6px 14px rgba(21, 128, 61, 0.35)`,
  },
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.primaryDark,
  },

  // ---------- Header ----------
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  headerBlobOne: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerBlobTwo: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(21,128,61,0.18)',
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  menuIcon: {
    fontSize: 18,
    color: colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#C3DEDA',
    marginTop: 2,
  },
  profileButton: {
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },

  // ---------- Search / actions ----------
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -14,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    ...cardShadow,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: colors.textGray,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...floatShadow,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },

  // ---------- Bottom nav ----------
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...cardShadow,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navIconWrap: {
    width: 40,
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  navIconWrapActive: {
    backgroundColor: colors.accentLight,
  },
  navIcon: {
    fontSize: 18,
    color: colors.textGray,
  },
  navIconActive: {
    color: colors.accent,
  },
  navText: {
    fontSize: 11,
    color: colors.textGray,
    fontWeight: '500',
  },
  navTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },

  // ---------- Product list ----------
  listContent: {
    padding: 18,
    paddingBottom: 36,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.textGray,
  },
  sectionHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: -6,
    marginBottom: 12,
  },
  categoryGroup: {
    marginBottom: 20,
  },
  categoryGroupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  categoryGroupCount: {
    fontSize: 12,
    color: colors.textGray,
  },
  categoryModalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  categoryModalItemActive: {
    backgroundColor: colors.primary,
  },
  categoryModalItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  categoryModalItemCount: {
    fontSize: 12,
    color: colors.textGray,
  },
  categoryModalItemTextActive: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textGray,
  },

  // ---------- Product card ----------
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardImageWrap: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: '#EAF3F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  cardIcon: {
    fontSize: 30,
  },
  cardInfo: {
    flex: 1,
  },
  cardCategory: {
    fontSize: 11,
    color: colors.primary,
    marginBottom: 3,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  cardPriceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accentDark,
  },
  cardEditButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEditButtonText: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: '700',
  },

  // ---------- Floating action button ----------
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...floatShadow,
  },
  fabIcon: {
    fontSize: 26,
    color: colors.white,
    marginTop: -2,
  },

  // ---------- Add product modal ----------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    maxHeight: '88%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textDark,
  },
  modalClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.textGray,
  },
  previewWrap: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    alignItems: 'center',
    gap: 4,
  },
  previewPlaceholderIcon: {
    fontSize: 26,
  },
  previewPlaceholderText: {
    fontSize: 11,
    color: colors.textGray,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
    marginTop: 12,
  },
  fieldInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.textDark,
  },
  fieldHint: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 5,
  },
  fieldError: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
    ...floatShadow,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },

  // ---------- Home / About screen ----------
  infoScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoScroll: {
    paddingBottom: 40,
  },
  heroWrap: {
    backgroundColor: colors.primaryDark,
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlobOne: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroBlobTwo: {
    position: 'absolute',
    bottom: -70,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(25,168,137,0.2)',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 18,
  },
  heroBadgeText: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.primaryLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 18,
    ...floatShadow,
  },
  heroCtaText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  heroCtaArrow: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -24,
    marginBottom: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textGray,
    textAlign: 'center',
  },

  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  featureIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textGray,
    lineHeight: 18,
  },

  infoBottomCta: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...floatShadow,
  },
  infoBottomCtaText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  infoFooter: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 20,
  },
});
