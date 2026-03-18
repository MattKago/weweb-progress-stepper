export default {
  editor: {
    label: { en: "Progress Stepper" },
    icon: 'list-numbers',
  },
  properties: {
    steps: {
      label: { en: 'Steps' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        { id: '1', title: 'Return Created', subtitle: 'Jan 2027 · VAT', isCompleted: true, needsReview: false, icon: 'check' },
        { id: '2', title: 'Files Uploaded', subtitle: '4 documents', isCompleted: true, needsReview: false, icon: 'check' },
        { id: '3', title: 'Events Captured', subtitle: '3 need review', isCompleted: false, needsReview: true, icon: 'warning' },
        { id: '4', title: 'Generate Return', subtitle: 'Not started', isCompleted: false, needsReview: false, icon: '' },
        { id: '5', title: 'Export & File', subtitle: 'Pending', isCompleted: false, needsReview: false, icon: '' }
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.title || `Step ${item.id || 'Unknown'}`;
        },
        item: {
          type: 'Object',
          defaultValue: { id: '', title: 'New Step', subtitle: '', isCompleted: false, needsReview: false, icon: '' },
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Text', bindable: true },
              title: { label: { en: 'Title' }, type: 'Text', bindable: true },
              subtitle: { label: { en: 'Subtitle' }, type: 'Text', bindable: true },
              isCompleted: { label: { en: 'Is Completed' }, type: 'OnOff', bindable: true },
              needsReview: { label: { en: 'Needs Review' }, type: 'OnOff', bindable: true },
              icon: { label: { en: 'Icon (Optional)' }, type: 'Text', bindable: true }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of step objects'
      },
      /* wwEditor:end */
    },

    // Formula Properties mappings
    idFormula: {
      label: { en: 'ID Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['id']" },
      hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
    },
    titleFormula: {
      label: { en: 'Title Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['title']" },
      hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
    },
    subtitleFormula: {
      label: { en: 'Subtitle Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['subtitle']" },
      hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
    },
    isCompletedFormula: {
      label: { en: 'Completed Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['isCompleted']" },
      hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
    },
    needsReviewFormula: {
      label: { en: 'Review Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['needsReview']" },
      hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
    },
    iconFormula: {
      label: { en: 'Icon Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['icon']" },
      hidden: (content, sidepanelContent, boundProps) => !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
    },

    // UI Configuration
    titleColor: { label: { en: 'Title Color' }, type: 'Color', section: 'style', defaultValue: '#333333', bindable: true },
    subtitleColor: { label: { en: 'Subtitle Color' }, type: 'Color', section: 'style', defaultValue: '#9ca3af', bindable: true },
    activeReviewSubtitleColor: { label: { en: 'Review Subtitle Color' }, type: 'Color', section: 'style', defaultValue: '#d97706', bindable: true },

    // Status Colors
    completedColor: { label: { en: 'Completed Color' }, type: 'Color', section: 'style', defaultValue: '#22c55e', bindable: true },
    completedIcon: { label: { en: 'Completed Icon' }, type: 'Icon', section: 'settings', defaultValue: 'fas fa-check', bindable: true },
    reviewColor: { label: { en: 'Review Color' }, type: 'Color', section: 'style', defaultValue: '#f59e0b', bindable: true },
    reviewIcon: { label: { en: 'Review Icon' }, type: 'Icon', section: 'settings', defaultValue: 'fas fa-exclamation-triangle', bindable: true },
    pendingColor: { label: { en: 'Pending Color' }, type: 'Color', section: 'style', defaultValue: '#e5e7eb', bindable: true },
    pendingTextColor: { label: { en: 'Pending Font Color' }, type: 'Color', section: 'style', defaultValue: '#4b5563', bindable: true },
  },
  triggerEvents: [
    { name: 'step-click', label: { en: 'On step click' }, event: { step: {} } },
  ]
};
