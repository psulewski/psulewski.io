## The Active Visual Semantics Dataset

Understanding visual intelligence in action requires bridging low-level perceptual mechanisms and high-level semantic understanding. We collected a large-scale dataset to investigate how we make sense of our environment via active visual exploration.

The dataset includes MEG and eye-tracking data from 5 participants freely viewing 4,080 natural scenes over 50+ hours of recording, yielding over 200,000 gaze events. Each participant was fitted with individually manufactured head stabilizers to ensure data quality across 10 sessions. Following exploration of selected scenes, participants provided verbal scene descriptions in German, which were transcribed and are available as part of the dataset. All scenes are compatible with the Natural Scenes Dataset (Allen et al., 2022) and selected with a semantically-balanced sampling approach. 
Work with Carmen Amme, Martin Hebart, Peter König & Tim Kietzmann 

## The saccades have it: The surprising timing of neural dynamics during active vision

Most studies of active vision assume that visual processing stages are initiated at fixation onset, equivalent to stimulus onset in static-viewing paradigms. Together with Carmen Amme and the team behind the AVS-Dataset, we challange this assumption.

Using head-stabilized MEG and eye tracking, we collected data from participants freely exploring thousands of natural images. Our analysis revealed that saccade onset, rather than fixation onset, betters explains the latency and amplitude of the early sensory component M100. This finding suggests that internally generated signals play a crucial role in the dynamics of sensory processing during active vision.

## Energy efficiency is all you need

How do sophisticated neural mechanisms for visual stability emerge? Together with Thomas Nortmann and Tim Kietzmann, we investigated whether predictive remapping and allocentric coding could arise from simple energy efficiency constraints, without requiring specialized architectural design or algorithmic hard-coding.

We exposed recurrent neural networks (RNNs) to sequences of fixation patches and saccadic efference copies, training models to minimize energy consumption. Remarkably, targeted inhibitory predictive remapping emerged from this optimization alone. The networks learned to recode egocentric coordinates into allocentric reference frames, demonstrating how complex spatial computations can arise from basic physical principles.

## Representational echoes in the visual system

Visual processing involves complex recurrent dynamics, but how do these manifest in neural population responses? I investigated the temporal dynamics of source projected MEG responses using time-resolved representational similarity analysis (RSA).

We identified two distinct types of representational patterns that reverberate across the visual system: stimulus-locked echoes that maintain object information over time, and diagonal echoes linked to ongoing alpha oscillations. This work reveals how recurrent connectivity shapes the temporal structure of visual information processing beyond the initial feedforward sweep. Work with Nikolaus Kriegeskorte, Peter König & Tim Kietzmann.