'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import CareerTimeline from './CareerTimeline';
import { fadeUp, stagger, vp } from '../../../lib/motion';
import W from '../ui/W';

export default function JourneySoFar() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-10">
            <h2>🎢 Journey So Far</h2>
            <Button href="https://thatguyabhishek.notion.site/About-fb861d61100943ee9356e50d28be3f03" external variant="outline">
              Know more
            </Button>
          </motion.div>
          <motion.div variants={fadeUp}>
            <CareerTimeline />
          </motion.div>
        </motion.div>
      </W>
    </div>
  );
}
