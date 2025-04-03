import { Handle, Position, NodeResizer } from '@xyflow/react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { 
  c4Tokens, 
  EVENT_STORMING_DOMAIN_EVENT,
  EVENT_STORMING_COMMAND,
  EVENT_STORMING_ACTOR,
  EVENT_STORMING_AGGREGATE,
  EVENT_STORMING_POLICY,
  EVENT_STORMING_READ_MODEL,
  EVENT_STORMING_EXTERNAL_SYSTEM,
  EVENT_STORMING_HOT_SPOT
} from '../theme/c4Theme';

// Styles for C4 nodes
const useStyles = makeStyles({
  c4NodeBase: {
    padding: c4Tokens.nodePadding,
    borderRadius: tokens.borderRadiusMedium,
    width: c4Tokens.nodeWidth,
    fontSize: c4Tokens.descriptionFontSize,
    color: tokens.colorNeutralForegroundInverted,
    textAlign: 'center',
    border: `1px solid ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  // Person node styles
  personNode: {
    border: `1px solid ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  personIcon: {
    width: c4Tokens.iconSize,
    height: c4Tokens.iconSize,
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Container node styles
  containerNode: {
    border: `2px dashed ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    padding: tokens.spacingVerticalM,
    minWidth: c4Tokens.containerWidth,
  },
  containerHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  containerIcon: {
    width: c4Tokens.iconSize,
    height: c4Tokens.iconSize,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorBrandBackground,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Component node styles
  componentNode: {
    border: `1px solid ${tokens.colorBrandForeground1}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  componentIcon: {
    width: c4Tokens.iconSize,
    height: c4Tokens.iconSize,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorBrandForeground1,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // System node styles
  systemNode: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  externalSystemNode: {
    border: `2px solid ${tokens.colorPaletteRedBorder2}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  internalSystemNode: {
    border: `2px solid ${tokens.colorPaletteBlueBackground2}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  systemIcon: {
    width: c4Tokens.iconSize,
    height: c4Tokens.iconSize,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralStroke1,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  externalSystemIcon: {
    width: c4Tokens.iconSize,
    height: c4Tokens.iconSize,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorPaletteRedBackground2,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  internalSystemIcon: {
    width: c4Tokens.iconSize,
    height: c4Tokens.iconSize,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorPaletteBlueBackground2,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Event Storming node styles
  eventStormingBase: {
    padding: c4Tokens.nodePadding,
    borderRadius: tokens.borderRadiusMedium,
    width: c4Tokens.nodeWidth,
    fontSize: c4Tokens.descriptionFontSize,
    color: tokens.colorNeutralForegroundInverted, // White text
    textAlign: 'center',
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackgroundInverted, // Black background
  },
  domainEventNode: {
    border: `2px solid ${EVENT_STORMING_DOMAIN_EVENT}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  commandNode: {
    border: `2px solid ${EVENT_STORMING_COMMAND}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  actorNode: {
    border: `2px solid ${EVENT_STORMING_ACTOR}`,
    position: 'relative',
    paddingTop: '40px', // Space for the stick figure
    borderRadius: tokens.borderRadiusMedium,
  },
  actorIcon: {
    position: 'absolute',
    top: '5px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: EVENT_STORMING_ACTOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aggregateNode: {
    border: `2px solid ${EVENT_STORMING_AGGREGATE}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  policyNode: {
    border: `2px solid ${EVENT_STORMING_POLICY}`,
    position: 'relative',
    paddingTop: '40px', // Space for the gear icon
    borderRadius: tokens.borderRadiusMedium,
  },
  policyIcon: {
    position: 'absolute',
    top: '5px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: EVENT_STORMING_POLICY,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readModelNode: {
    border: `2px solid ${EVENT_STORMING_READ_MODEL}`,
    position: 'relative',
    paddingTop: '40px', // Space for the document icon
    borderRadius: tokens.borderRadiusMedium,
  },
  readModelIcon: {
    position: 'absolute',
    top: '5px',
    width: '30px',
    height: '30px',
    backgroundColor: EVENT_STORMING_READ_MODEL,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.borderRadiusSmall,
  },
  externalSystemNodeEventStorming: {
    border: `2px solid ${EVENT_STORMING_EXTERNAL_SYSTEM}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  hotSpotNode: {
    border: `2px solid ${EVENT_STORMING_HOT_SPOT}`,
    position: 'relative',
    borderRadius: tokens.borderRadiusMedium,
  },
  // Common styles
  nodeLabel: {
    fontWeight: 'bold',
    fontSize: c4Tokens.labelFontSize,
    marginBottom: '4px',
  },
  nodeDescription: {
    fontSize: c4Tokens.descriptionFontSize,
    textAlign: 'center',
  },
  technology: {
    fontSize: c4Tokens.descriptionFontSize,
    marginBottom: '4px',
    color: tokens.colorNeutralForegroundInverted,
  },
  dottedLine: {
    width: '80%',
    height: '1px',
    borderTop: `1px dotted ${tokens.colorNeutralForegroundInverted}`,
    margin: '8px 0',
  },
  handle: {
    width: c4Tokens.handleSize,
    height: c4Tokens.handleSize,
    backgroundColor: tokens.colorBrandBackground,
  },
});

// Person node component
export const PersonNode = ({ data }: { data: { label: string; description?: string; role?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.c4NodeBase} ${styles.personNode}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <div className={styles.personIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="personIconTitle">
          <title id="personIconTitle">Person Icon</title>
          <circle cx="12" cy="7" r="5" fill="white"/>
          <path d="M3 19c0-4.4 3.6-8 8-8h2c4.4 0 8 3.6 8 8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {(data.role || data.description) && <div className={styles.dottedLine} />}
      
      {data.role && (
        <Text className={styles.nodeDescription}>[{data.role}]</Text>
      )}
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// Container node component - designed as a group node
export const ContainerNode = ({ data }: { data: { label: string; description?: string; technology?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.containerNode}>
      <div className={styles.containerHeader}>
        <div className={styles.containerIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="containerIconTitle">
            <title id="containerIconTitle">Container Icon</title>
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="7" y="9" width="10" height="6" rx="1" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        <Text className={styles.nodeLabel}>{data.label}</Text>
        
        {(data.technology || data.description) && <div className={styles.dottedLine} />}
        
        {data.technology && (
          <Text className={styles.technology}>[{data.technology}]</Text>
        )}
        
        {data.description && (
          <Text className={styles.nodeDescription}>{data.description}</Text>
        )}
      </div>
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <NodeResizer 
        color={tokens.colorBrandBackground}
        isVisible={true}
        minWidth={300}
        minHeight={300}
      />
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// Component node component
export const ComponentNode = ({ data }: { data: { label: string; description?: string; technology?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.c4NodeBase} ${styles.componentNode}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <div className={styles.componentIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="componentIconTitle">
          <title id="componentIconTitle">Component Icon</title>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {(data.technology || data.description) && <div className={styles.dottedLine} />}
      
      {data.technology && (
        <Text className={styles.technology}>[{data.technology}]</Text>
      )}
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// System node component
export const SystemNode = ({ data }: { data: { label: string; description?: string; external?: boolean } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.c4NodeBase} ${data.external ? styles.externalSystemNode : styles.internalSystemNode}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <div className={data.external ? styles.externalSystemIcon : styles.internalSystemIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="systemIconTitle">
          <title id="systemIconTitle">System Icon</title>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {(data.external !== undefined || data.description) && <div className={styles.dottedLine} />}
      
      {data.external !== undefined && (
        <Text className={styles.technology}>
          [System Type: {data.external ? "External" : "Internal"}]
        </Text>
      )}
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// Event Storming node components
export const DomainEventNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.domainEventNode}`}>
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const CommandNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.commandNode}`}>
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const ActorNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.actorNode}`}>
      <div className={styles.actorIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="actorIconTitle">
          <title id="actorIconTitle">Actor Icon</title>
          <circle cx="12" cy="7" r="5" fill="white"/>
          <path d="M3 19c0-4.4 3.6-8 8-8h2c4.4 0 8 3.6 8 8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const AggregateNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.aggregateNode}`}>
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const PolicyNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.policyNode}`}>
      <div className={styles.policyIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="policyIconTitle">
          <title id="policyIconTitle">Policy Icon</title>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const ReadModelNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.readModelNode}`}>
      <div className={styles.readModelIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="readModelIconTitle">
          <title id="readModelIconTitle">Read Model Icon</title>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const ExternalSystemNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.externalSystemNodeEventStorming}`}>
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

export const HotSpotNode = ({ data }: { data: { label: string; description?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.eventStormingBase} ${styles.hotSpotNode}`}>
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
    </div>
  );
};

// Export all C4 node types
export const c4NodeTypes = {
  person: PersonNode,
  container: ContainerNode,
  component: ComponentNode,
  system: SystemNode,
  domainEvent: DomainEventNode,
  command: CommandNode,
  actor: ActorNode,
  aggregate: AggregateNode,
  policy: PolicyNode,
  readModel: ReadModelNode,
  externalSystem: ExternalSystemNode,
  hotSpot: HotSpotNode,
};
