<template>
  <div class="progress-stepper-wrapper" :style="cssVariables">
    <div class="stepper-container">
      <div 
        v-for="(step, index) in processedSteps" 
        :key="step.id" 
        class="step-item"
        :class="['state-' + step.state, { 'is-last': index === processedSteps.length - 1 }]"
        @click="$emit('trigger-event', { name: 'step-click', event: { step: step.originalItem } })"
      >
        <div class="step-indicator">
          <div class="step-line" v-if="index !== processedSteps.length - 1" :class="'line-' + getLineState(index)"></div>
          <div class="step-icon">
            <wwElement v-if="step.icon && step.icon !== 'check' && step.icon !== 'warning'" v-bind="step.icon" />
            <i v-else-if="step.state === 'completed' || step.icon === 'check'" :class="content.completedIcon || 'fas fa-check'" class="dynamic-icon"></i>
            <i v-else-if="step.state === 'review' || step.icon === 'warning'" :class="content.reviewIcon || 'fas fa-exclamation-triangle'" class="dynamic-icon"></i>
            <span v-else class="step-number">{{ index + 1 }}</span>
          </div>
        </div>
        <div class="step-text">
          <div class="step-subtitle">{{ step.subtitle }}</div>
          <div class="step-title">{{ step.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue';

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props, { emit }) {
    
    // WeWeb Reactivity Pattern
    const processedSteps = computed(() => {
      const steps = props.content?.steps || [];
      const { resolveMappingFormula } = wwLib.wwFormula.useFormula();
      
      return steps.map(item => {
        const id = resolveMappingFormula(props.content?.idFormula, item) ?? item.id;
        const title = resolveMappingFormula(props.content?.titleFormula, item) ?? item.title;
        const subtitle = resolveMappingFormula(props.content?.subtitleFormula, item) ?? item.subtitle;
        const isCompleted = resolveMappingFormula(props.content?.isCompletedFormula, item) ?? item.isCompleted;
        const needsReview = resolveMappingFormula(props.content?.needsReviewFormula, item) ?? item.needsReview;
        const icon = resolveMappingFormula(props.content?.iconFormula, item) ?? item.icon;

        let state = 'pending';
        if (needsReview) state = 'review';
        else if (isCompleted) state = 'completed';

        return {
          id: id || `step-${Date.now()}-${Math.random()}`,
          title: title || '',
          subtitle: subtitle || '',
          state,
          icon,
          originalItem: item
        };
      });
    });

    const getLineState = (index) => {
      // The line between step i and step i+1
      const nextStep = processedSteps.value[index + 1];
      if (!nextStep) return 'pending';
      return nextStep.state;
    };

    const cssVariables = computed(() => ({
      '--title-color': props.content?.titleColor || '#333333',
      '--subtitle-color': props.content?.subtitleColor || '#9ca3af',
      '--review-subtitle-color': props.content?.activeReviewSubtitleColor || '#d97706',
      '--completed-color': props.content?.completedColor || '#22c55e',
      '--review-color': props.content?.reviewColor || '#f59e0b',
      '--pending-color': props.content?.pendingColor || '#e5e7eb',
      '--pending-text-color': props.content?.pendingTextColor || '#4b5563',
    }));

    watch(() => [
      props.content?.steps,
      props.content?.completedColor,
      props.content?.reviewColor,
      props.content?.pendingColor,
    ], () => {
      // Automatic visual updates via Vue Reactivity
    }, { deep: true });

    return {
      processedSteps,
      getLineState,
      cssVariables
    };
  }
};
</script>

<style lang="scss" scoped>
.progress-stepper-wrapper {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  width: 100%;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow-x: auto;
  
  .stepper-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    min-width: 600px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    flex: 1;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &.is-last {
      flex: 0 0 auto;
      min-width: 100px;
    }
  }
  
  .step-indicator {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    height: 40px;
    margin-bottom: 12px;
  }
  
  .step-line {
    position: absolute;
    top: 50%;
    left: 48px;
    width: calc(100% - 56px);
    height: 4px;
    border-radius: 2px;
    transform: translateY(-50%);
    z-index: 1;
    transition: background-color 0.3s ease;
    
    &.line-completed { background-color: var(--completed-color); }
    &.line-review { background-color: var(--review-color); }
    &.line-pending { background-color: var(--pending-color); }
  }
  
  .is-last .step-line {
    display: none;
  }
  
  .step-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    margin: 0;
    flex-shrink: 0;
    background-color: var(--pending-color);
    color: var(--pending-text-color);
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    
    .dynamic-icon {
      font-size: 16px;
    }
  }
  
  .state-completed .step-icon {
    background-color: var(--completed-color);
    color: white;
  }
  
  .state-review .step-icon {
    background-color: var(--review-color);
    color: white;
  }
  
  .state-pending .step-icon {
    background-color: var(--pending-color);
    color: var(--pending-text-color);
  }
  
  .step-text {
    text-align: left;
    width: 100%;
    padding: 0;
  }
  
  .step-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--title-color);
    margin-bottom: 0px;
    white-space: nowrap;
  }
  
  .step-subtitle {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--subtitle-color);
    margin-bottom: 4px;
    white-space: nowrap;
  }
  
  .state-review .step-subtitle {
    color: var(--review-subtitle-color);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .progress-stepper-wrapper {
      padding: 16px;
    }
    .stepper-container {
      flex-direction: column;
      align-items: stretch;
      min-width: unset;
      gap: 0;
    }
    .step-item {
      flex-direction: row;
      align-items: stretch;
      margin-bottom: 24px;
      
      &:hover {
        transform: translateX(4px);
      }
      
      &.is-last {
        margin-bottom: 0;
      }
    }
    .step-indicator {
      width: 40px;
      height: auto;
      min-height: 40px;
      margin-bottom: 0;
      margin-right: 16px;
      flex-direction: column;
    }
    .step-line {
      left: 50%;
      top: 48px;
      width: 4px;
      height: calc(100% - 32px);
      transform: translateX(-50%);
    }
    .step-text {
      text-align: left;
      padding: 0;
      padding-top: 4px;
    }
    .step-title, .step-subtitle {
      white-space: normal;
    }
  }
}
</style>
